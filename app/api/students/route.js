import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Student from '@/lib/models/Student';
import { verifyToken } from '@/lib/middleware/authMiddleware';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Connect to database
    await connectDB();

    // Check if it's a cookie-based request (from frontend) or token-based (API)
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    // Fetch students for the authenticated user
    let query = Student.find({ userId: verified.userId });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const students = await query.sort({ createdAt: -1 });
    
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    // Get student data from request body
    const studentData = await request.json();
    
    // Add userId to the student data
    const newStudentData = {
      ...studentData,
      userId: verified.userId
    };
    
    // Create new student
    const newStudent = new Student(newStudentData);
    await newStudent.save();
    
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
