/**
 * studentsData.ts — 50 Students Roster Dataset and Course Definitions
 * ====================================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Provides immutable student data and schedule configurations for:
 * - CCPGLANG (Programming Languages)
 * - CCINTHCI (Human Computer Interaction)
 * - CCAUTOMATA (Automata Theory)
 * - CCDATRCL (Data Structure)
 */

export interface StudentRecord {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'select';
  time: string;
  remarks: string;
}

export interface ClassInfo {
  code: string;
  name: string;
  section: string;
  timeSlot: string;
  room: string;
  days: string;
  description: string;
}

export const CLASS_CONFIGS: Record<string, ClassInfo> = {
  CCPGLANG: {
    code: 'CCPGLANG',
    name: 'Programming Languages',
    section: 'COM232',
    timeSlot: '3:00 PM - 5:00 PM',
    room: 'Computer Lab 402',
    days: 'Monday & Wednesday',
    description: 'Comparative study of programming paradigms: Functional vs. Object-Oriented.',
  },
  CCINTHCI: {
    code: 'CCINTHCI',
    name: 'Human Computer Interaction',
    section: 'COM232',
    timeSlot: '5:00 PM - 7:00 PM',
    room: 'Mac Lab 305',
    days: 'Tuesday & Thursday',
    description: 'User-centered design, UI/UX prototyping, usability evaluation.',
  },
  CCAUTOMATA: {
    code: 'CCAUTOMATA',
    name: 'Automata Theory',
    section: 'COM232',
    timeSlot: '9:30 AM - 11:30 AM',
    room: 'Lecture Hall 204',
    days: 'Monday & Wednesday',
    description: 'Formal languages, finite state automata, and computability theory.',
  },
  CCDATRCL: {
    code: 'CCDATRCL',
    name: 'Data Structure',
    section: 'COM232',
    timeSlot: '1:30 PM - 3:00 PM',
    room: 'Computer Lab 401',
    days: 'Friday',
    description: 'Linear & non-linear structures, sorting, trees, hashing, and complexity.',
  },
};

/**
 * Full 50-student dataset provided by faculty specification
 */
export const RAW_STUDENTS_LIST: ReadonlyArray<{ id: string; name: string; firstName: string; lastName: string }> = [
  { id: '2023-001', name: 'Smith, James', firstName: 'James', lastName: 'Smith' },
  { id: '2023-002', name: 'Anderson, Christopher', firstName: 'Christopher', lastName: 'Anderson' },
  { id: '2023-003', name: 'Clark, Ronald', firstName: 'Ronald', lastName: 'Clark' },
  { id: '2023-004', name: 'Wright, Mary', firstName: 'Mary', lastName: 'Wright' },
  { id: '2023-005', name: 'Mitchell, Lisa', firstName: 'Lisa', lastName: 'Mitchell' },
  { id: '2023-006', name: 'Johnson, Michelle', firstName: 'Michelle', lastName: 'Johnson' },
  { id: '2023-007', name: 'Thomas, John', firstName: 'John', lastName: 'Thomas' },
  { id: '2023-008', name: 'Rodriguez, Daniel', firstName: 'Daniel', lastName: 'Rodriguez' },
  { id: '2023-009', name: 'Lopez, Anthony', firstName: 'Anthony', lastName: 'Lopez' },
  { id: '2023-010', name: 'Perez, Patricia', firstName: 'Patricia', lastName: 'Perez' },
  { id: '2023-011', name: 'Williams, Nancy', firstName: 'Nancy', lastName: 'Williams' },
  { id: '2023-012', name: 'Jackson, Laura', firstName: 'Laura', lastName: 'Jackson' },
  { id: '2023-013', name: 'Lewis, Robert', firstName: 'Robert', lastName: 'Lewis' },
  { id: '2023-014', name: 'Hill, Paul', firstName: 'Paul', lastName: 'Hill' },
  { id: '2023-015', name: 'Roberts, Kevin', firstName: 'Kevin', lastName: 'Roberts' },
  { id: '2023-016', name: 'Jones, Linda', firstName: 'Linda', lastName: 'Jones' },
  { id: '2023-017', name: 'White, Karen', firstName: 'Karen', lastName: 'White' },
  { id: '2023-018', name: 'Lee, Sarah', firstName: 'Sarah', lastName: 'Lee' },
  { id: '2023-019', name: 'Scott, Michael', firstName: 'Michael', lastName: 'Scott' },
  { id: '2023-020', name: 'Turner, Mark', firstName: 'Mark', lastName: 'Turner' },
  { id: '2023-021', name: 'Brown, Jason', firstName: 'Jason', lastName: 'Brown' },
  { id: '2023-022', name: 'Harris, Barbara', firstName: 'Barbara', lastName: 'Harris' },
  { id: '2023-023', name: 'Walker, Betty', firstName: 'Betty', lastName: 'Walker' },
  { id: '2023-024', name: 'Green, Kimberly', firstName: 'Kimberly', lastName: 'Green' },
  { id: '2023-025', name: 'Phillips, William', firstName: 'William', lastName: 'Phillips' },
  { id: '2023-026', name: 'Davis, Donald', firstName: 'Donald', lastName: 'Davis' },
  { id: '2023-027', name: 'Martin, Jeff', firstName: 'Jeff', lastName: 'Martin' },
  { id: '2023-028', name: 'Hall, Elizabeth', firstName: 'Elizabeth', lastName: 'Hall' },
  { id: '2023-029', name: 'Adams, Helen', firstName: 'Helen', lastName: 'Adams' },
  { id: '2023-030', name: 'Campbell, Deborah', firstName: 'Deborah', lastName: 'Campbell' },
  { id: '2023-031', name: 'Miller, David', firstName: 'David', lastName: 'Miller' },
  { id: '2023-032', name: 'Thompson, George', firstName: 'George', lastName: 'Thompson' },
  { id: '2023-033', name: 'Allen, Jennifer', firstName: 'Jennifer', lastName: 'Allen' },
  { id: '2023-034', name: 'Baker, Sandra', firstName: 'Sandra', lastName: 'Baker' },
  { id: '2023-035', name: 'Parker, Richard', firstName: 'Richard', lastName: 'Parker' },
  { id: '2023-036', name: 'Wilson, Kenneth', firstName: 'Kenneth', lastName: 'Wilson' },
  { id: '2023-037', name: 'Garcia, Maria', firstName: 'Maria', lastName: 'Garcia' },
  { id: '2023-038', name: 'Young, Donna', firstName: 'Donna', lastName: 'Young' },
  { id: '2023-039', name: 'Gonzalez, Charles', firstName: 'Charles', lastName: 'Gonzalez' },
  { id: '2023-040', name: 'Evans, Steven', firstName: 'Steven', lastName: 'Evans' },
  { id: '2023-041', name: 'Moore, Susan', firstName: 'Susan', lastName: 'Moore' },
  { id: '2023-042', name: 'Martinez, Carol', firstName: 'Carol', lastName: 'Martinez' },
  { id: '2023-043', name: 'Hernandez, Joseph', firstName: 'Joseph', lastName: 'Hernandez' },
  { id: '2023-044', name: 'Nelson, Edward', firstName: 'Edward', lastName: 'Nelson' },
  { id: '2023-045', name: 'Edwards, Margaret', firstName: 'Margaret', lastName: 'Edwards' },
  { id: '2023-046', name: 'Taylor, Ruth', firstName: 'Ruth', lastName: 'Taylor' },
  { id: '2023-047', name: 'Robinson, Thomas', firstName: 'Thomas', lastName: 'Robinson' },
  { id: '2023-048', name: 'Brian, King', firstName: 'Brian', lastName: 'King' },
  { id: '2023-049', name: 'Carter, Dorothy', firstName: 'Dorothy', lastName: 'Carter' },
  { id: '2023-050', name: 'Collins, Sharon', firstName: 'Sharon', lastName: 'Collins' },
];

/**
 * Pure generator creating initial attendance state tailored per course
 */
export const getInitialClassRoster = (classCode: string): StudentRecord[] => {
  // Deterministic seed pattern based on classCode char codes
  const seed = classCode.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return RAW_STUDENTS_LIST.map((student, idx) => {
    const val = (idx + seed) % 10;
    
    // Default statuses distribution:
    // ~75% present, ~12% late, ~8% absent, ~5% excused
    let status: StudentRecord['status'] = 'present';
    let time = '3:02 PM';
    let remarks = '';

    if (val === 2) {
      status = 'absent';
      time = '--';
      remarks = idx % 2 === 0 ? 'Sick leave requested' : 'Unexcused absence';
    } else if (val === 5 || val === 8) {
      status = 'late';
      time = `3:${15 + (idx % 12)} PM`;
      remarks = 'Transit / commute delay';
    } else if (val === 9) {
      status = 'excused';
      time = '--';
      remarks = 'University event official permit';
    } else {
      status = 'present';
      const minute = (idx * 3) % 10;
      time = `3:0${minute} PM`;
      remarks = '';
    }

    return {
      id: student.id,
      name: student.name,
      firstName: student.firstName,
      lastName: student.lastName,
      status,
      time,
      remarks,
    };
  });
};
