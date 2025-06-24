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
    
    // Save activity to student's discarded activities
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: params.id, userId: verified.userId },
      { $push: { discarded_activities: activityData } },
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
    console.error('Error saving discarded activity:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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

    const { activityId } = await request.json();
    if (!activityId) {
      return NextResponse.json(
        { error: 'activityId is required in request body' },
        { status: 400 }
      );
    }

    // Find the student and the discarded activity
    const student = await Student.findOne(
      { _id: params.id, userId: verified.userId }
    );
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Find the activity in discarded activities
    const activityIndex = student.discarded_activities.findIndex(
      activity => activity._id.toString() === activityId
    );
    
    if (activityIndex === -1) {
      return NextResponse.json(
        { error: 'Discarded activity not found' },
        { status: 404 }
      );
    }

    // Move activity from discarded to saved
    const activity = student.discarded_activities[activityIndex];
    student.discarded_activities.splice(activityIndex, 1);
    student.saved_activities.push(activity);
    
    await student.save();
    
    return NextResponse.json(student);
  } catch (error) {
    console.error('Error restoring discarded activity:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
