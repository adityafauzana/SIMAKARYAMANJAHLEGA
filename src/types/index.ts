export interface User {
  nrp: string;
  name: string;
  role: 'ketua' | 'sekretaris' | 'bendahara' | 'wakil-sekretaris' | 'kepala-bidang' | 'ketua-unit-teknis-rw-1' | 'ketua-unit-teknis-rw-2' | 'ketua-unit-teknis-rw-3' | 'ketua-unit-teknis-rw-4' | 'ketua-unit-teknis-rw-5' | 'ketua-unit-teknis-rw-6' | 'ketua-unit-teknis-rw-7' | 'ketua-unit-teknis-rw-8' | 'ketua-unit-teknis-rw-9' | 'ketua-unit-teknis-rw-10' | 'ketua-unit-teknis-rw-11' | 'ketua-unit-teknis-rw-12' | 'ketua-unit-teknis-rw-13' | 'ketua-unit-teknis-rw-14' | 'ketua-unit-teknis-rw-15' | 'ketua-unit-teknis-rw-16' | 'anggota';
  bidang?: string;
  password: string;
  profilePhoto?: string;
  email?: string;
  phone?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  photos: string[];
  createdBy: string;
  bidang: string;
  status: 'pending' | 'approved' | 'rejected';
  validatedBy?: string;
  validatedAt?: string;
}

export interface Report {
  id: string;
  title: string;
  period: 'quarterly' | 'annual';
  year: number;
  quarter?: number;
  content: string;
  documents: string[];
  createdBy: string;
  bidang: string;
  status: 'pending' | 'approved' | 'rejected';
  validatedBy?: string;
  validatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  files: string[];
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ProgressStats {
  totalMembers: number;
  activeMembers: number;
  activitiesThisMonth: number;
  reportsSubmitted: number;
  tasksCompleted: number;
  overallProgress: number;
}