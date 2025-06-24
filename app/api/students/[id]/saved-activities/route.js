import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Student from '@/lib/models/Student';
import { verifyToken } from '@/lib/middleware/authMiddleware';
import jwt from 'jsonwebtoken';

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

    const activityData = await request.json();
    
    // Save activity to student's saved activities
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: params.id, userId: verified.userId },
      { $push: { saved_activities: activityData } },
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
    console.error('Error saving activity:', error);
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
    const activityId = searchParams.get('activityId');
    
    if (!activityId) {
      return NextResponse.json(
        { error: 'activityId is required' },
        { status: 400 }
      );
    }

    // Remove activity from student's saved activities
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: params.id, userId: verified.userId },
      { $pull: { saved_activities: { _id: activityId } } },
      { new: true }
    );
    
    if (!updatedStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error deleting saved activity:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
