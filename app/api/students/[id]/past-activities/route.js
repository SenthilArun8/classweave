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
    
    // Add past activity to student's activity history
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: params.id, userId: verified.userId },
      { $push: { activity_history: activityData } },
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
    console.error('Error adding past activity:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

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

    // Find student and return their past activities (activity_history)
    const student = await Student.findOne(
      { _id: params.id, userId: verified.userId },
      { name: 1, activity_history: 1 }
    );
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      name: student.name,
      past_activities: student.activity_history || []
    });
  } catch (error) {
    console.error('Error fetching past activities:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
