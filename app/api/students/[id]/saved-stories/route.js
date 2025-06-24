import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Student from '@/lib/models/Student';
import { verifyToken } from '@/lib/middleware/authMiddleware';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    // Check for authentication
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    let verified = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      // Token-based authentication
      const token = authHeader.split(' ')[1];
      verified = await verifyToken(token);
    } else if (cookieHeader?.includes('token=')) {
      // Cookie-based authentication
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      if (cookies.token) {
        verified = jwt.verify(cookies.token, process.env.JWT_SECRET);
      }
    }
    
    if (!verified) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get student's saved stories
    const student = await Student.findOne(
      { _id: params.id, userId: verified.userId },
      { saved_stories: 1 }
    );
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(student.saved_stories || []);
  } catch (error) {
    console.error('Error fetching saved stories:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    // Check for authentication
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    let verified = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      // Token-based authentication
      const token = authHeader.split(' ')[1];
      verified = await verifyToken(token);
    } else if (cookieHeader?.includes('token=')) {
      // Cookie-based authentication
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      if (cookies.token) {
        verified = jwt.verify(cookies.token, process.env.JWT_SECRET);
      }
    }
    
    if (!verified) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const storyData = await request.json();
    
    // Save story to student's saved stories
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: params.id, userId: verified.userId },
      { $push: { saved_stories: storyData } },
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedStudent, { status: 201 });
  } catch (error) {
    console.error('Error saving story:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    // Check for authentication
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    let verified = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      // Token-based authentication
      const token = authHeader.split(' ')[1];
      verified = await verifyToken(token);
    } else if (cookieHeader?.includes('token=')) {
      // Cookie-based authentication
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      if (cookies.token) {
        verified = jwt.verify(cookies.token, process.env.JWT_SECRET);
      }
    }
    
    if (!verified) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const storyIndex = searchParams.get('storyIndex');
    
    if (storyIndex === null) {
      return NextResponse.json(
        { error: 'storyIndex is required' },
        { status: 400 }
      );
    }

    // Get student first to access the saved stories array
    const student = await Student.findOne(
      { _id: params.id, userId: verified.userId }
    );
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Remove story at the specified index
    const savedStories = student.saved_stories || [];
    const index = parseInt(storyIndex);
    
    if (index < 0 || index >= savedStories.length) {
      return NextResponse.json(
        { error: 'Invalid story index' },
        { status: 400 }
      );
    }

    savedStories.splice(index, 1);
    
    // Update the student with the modified array
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: params.id, userId: verified.userId },
      { saved_stories: savedStories },
      { new: true }
    );
    
    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error deleting saved story:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
