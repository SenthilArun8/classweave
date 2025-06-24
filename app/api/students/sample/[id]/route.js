import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Student from '@/lib/models/Student';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Access params directly without destructuring
    const { id } = await params;
    
    // First, try to fetch the actual student from the database
    const student = await Student.findById(id).lean();
    
    if (student) {
      // Return the actual student data from the database
      return NextResponse.json(student);
    }
    
    // If student not found in database, return fallback sample data
    const sampleStudents = {
      '683d57f853223cfb0c1e5723': {
        _id: '683d57f853223cfb0c1e5723',
        name: 'Ava Johnson',
        gender: 'female',
        age_months: 36,
        toddler_description: 'A curious and energetic learner who loves exploring new activities.',
        personality: 'Enthusiastic, Social',
        developmental_stage: 'Preschool',
        energy_level: 'high',
        interests: ['Drawing', 'Music', 'Blocks'],
        goals: ['Improve fine motor skills', 'Develop social skills', 'Learn basic counting'],
        recent_activity: {
          name: 'Building with blocks',
          result: 'Built a tall tower',
          difficulty_level: 'Medium',
          observations: 'Worked well with peers and showed great concentration'
        }
      },
      '683d590053223cfb0c1e5724': {
        _id: '683d590053223cfb0c1e5724',
        name: 'Liam Smith',
        gender: 'male',
        age_months: 48,
        toddler_description: 'Loves stories and outdoor play. Very thoughtful and observant child.',
        personality: 'Thoughtful, Observant',
        developmental_stage: 'Pre-K',
        energy_level: 'medium',
        interests: ['Stories', 'Nature', 'Puzzles'],
        goals: ['Enhance vocabulary', 'Develop problem-solving skills', 'Build confidence'],
        recent_activity: {
          name: 'Story time',
          result: 'Listened attentively and retold the story',
          difficulty_level: 'Easy',
          observations: 'Asked insightful questions about the characters'
        }
      }
    };

    const sampleStudent = sampleStudents[id];

    if (!sampleStudent) {
      return NextResponse.json({ error: 'Sample student not found' }, { status: 404 });
    }

    return NextResponse.json(sampleStudent);
  } catch (error) {
    console.error('Error fetching sample student:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sample student' },
      { status: 500 }
    );
  }
}
