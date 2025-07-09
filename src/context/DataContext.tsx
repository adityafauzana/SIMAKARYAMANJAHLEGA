import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { users as initialUsers } from '../data/users';

interface Activity {
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
  createdAt: string;
}

interface Report {
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
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  files: string[];
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface UserProgress {
  userId: string;
  userName: string;
  bidang: string;
  activitiesCount: number;
  reportsCount: number;
  tasksCompleted: number;
  progressPercentage: number;
  lastActivity: string;
}

interface BidangProgress {
  bidang: string;
  totalMembers: number;
  activitiesCount: number;
  reportsCount: number;
  averageProgress: number;
  completionRate: number;
}

interface DataContextType {
  users: User[];
  activities: Activity[];
  reports: Report[];
  tasks: Task[];
  announcements: Announcement[];
  userProgress: UserProgress[];
  bidangProgress: BidangProgress[];
  isOnline: boolean;
  lastSyncTime: string;
  addUser: (user: Omit<User, 'profilePhoto'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (nrp: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateActivityStatus: (id: string, status: 'approved' | 'rejected', validatedBy: string) => void;
  updateReportStatus: (id: string, status: 'approved' | 'rejected', validatedBy: string) => void;
  updateTaskStatus: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
  deleteActivity: (id: string) => void;
  deleteReport: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
  getUserProgress: (userName: string) => UserProgress | null;
  getBidangProgress: (bidang: string) => BidangProgress | null;
  getOverallStats: () => {
    totalActivities: number;
    totalReports: number;
    totalTasks: number;
    averageProgress: number;
    activeMembers: number;
  };
  syncData: () => void;
  forceRefresh: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [bidangProgress, setBidangProgress] = useState<BidangProgress[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize users data on first load
  const initializeUsersData = () => {
    const savedUsers = localStorage.getItem('simakarya_users');
    if (!savedUsers) {
      // First time setup - save initial users to localStorage
      console.log('🔧 First time setup - initializing users data');
      localStorage.setItem('simakarya_users', JSON.stringify(initialUsers));
      setUsers(initialUsers);
    } else {
      // Load existing users from localStorage
      try {
        const parsedUsers = JSON.parse(savedUsers);
        console.log('👥 Loading existing users from storage:', parsedUsers.length, 'users');
        setUsers(parsedUsers);
      } catch (error) {
        console.error('❌ Error parsing users data, using initial users:', error);
        localStorage.setItem('simakarya_users', JSON.stringify(initialUsers));
        setUsers(initialUsers);
      }
    }
  };

  // Real-time sync system
  useEffect(() => {
    // Initialize all data from localStorage
    initializeUsersData();
    loadDataFromStorage();
    setIsInitialized(true);

    // Listen for storage changes (cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('simakarya_')) {
        console.log('🔄 Data changed in another tab/device, syncing...', e.key);
        if (e.key === 'simakarya_users') {
          // Special handling for users data
          try {
            const newUsers = e.newValue ? JSON.parse(e.newValue) : initialUsers;
            setUsers(newUsers);
            console.log('👥 Users data synced from storage:', newUsers.length, 'users');
          } catch (error) {
            console.error('❌ Error syncing users data:', error);
          }
        }
        loadDataFromStorage();
        updateSyncTime();
      }
    };

    // Listen for custom sync events (same-tab updates)
    const handleCustomSync = (e: CustomEvent) => {
      console.log('🔄 Custom sync event received:', e.detail);
      if (e.detail.key === 'users') {
        initializeUsersData();
      }
      loadDataFromStorage();
      updateSyncTime();
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Back online, syncing data...');
      initializeUsersData();
      loadDataFromStorage();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📴 Gone offline, data will sync when back online');
    };

    // Listen for visibility change (when user switches tabs/apps)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Tab became visible, checking for updates...');
        initializeUsersData();
        loadDataFromStorage();
        updateSyncTime();
      }
    };

    // Listen for focus (when user returns to the app)
    const handleFocus = () => {
      console.log('🎯 App focused, syncing data...');
      initializeUsersData();
      loadDataFromStorage();
      updateSyncTime();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('simakarya-sync', handleCustomSync as EventListener);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Periodic sync every 30 seconds
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        console.log('⏰ Periodic sync check...');
        initializeUsersData();
        loadDataFromStorage();
        updateSyncTime();
      }
    }, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('simakarya-sync', handleCustomSync as EventListener);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(syncInterval);
    };
  }, []);

  // Update sync time
  const updateSyncTime = () => {
    const now = new Date().toLocaleString('id-ID');
    setLastSyncTime(now);
    localStorage.setItem('simakarya_last_sync', now);
  };

  // Load data from localStorage
  const loadDataFromStorage = () => {
    try {
      const savedActivities = localStorage.getItem('simakarya_activities');
      const savedReports = localStorage.getItem('simakarya_reports');
      const savedTasks = localStorage.getItem('simakarya_tasks');
      const savedAnnouncements = localStorage.getItem('simakarya_announcements');
      const savedSyncTime = localStorage.getItem('simakarya_last_sync');

      if (savedActivities) {
        const parsedActivities = JSON.parse(savedActivities);
        setActivities(parsedActivities);
      }
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports);
        setReports(parsedReports);
      }
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      }
      if (savedAnnouncements) {
        const parsedAnnouncements = JSON.parse(savedAnnouncements);
        setAnnouncements(parsedAnnouncements);
      }
      if (savedSyncTime) {
        setLastSyncTime(savedSyncTime);
      }

      console.log('✅ Data loaded from storage successfully');
    } catch (error) {
      console.error('❌ Error loading data from storage:', error);
    }
  };

  // Save data to localStorage and trigger sync
  const saveDataToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(`simakarya_${key}`, JSON.stringify(data));
      updateSyncTime();
      
      // Trigger custom event for same-tab sync
      window.dispatchEvent(new CustomEvent('simakarya-sync', { 
        detail: { key, timestamp: Date.now() } 
      }));
      
      console.log(`💾 Data saved to storage: ${key}`);
    } catch (error) {
      console.error(`❌ Error saving data to storage (${key}):`, error);
    }
  };

  // Calculate progress whenever data changes
  useEffect(() => {
    if (isInitialized) {
      calculateProgress();
    }
  }, [activities, reports, tasks, users, isInitialized]);

  // Save to localStorage whenever data changes with real-time sync
  useEffect(() => {
    if (isInitialized && users.length > 0) {
      saveDataToStorage('users', users);
    }
  }, [users, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveDataToStorage('activities', activities);
    }
  }, [activities, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveDataToStorage('reports', reports);
    }
  }, [reports, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveDataToStorage('tasks', tasks);
    }
  }, [tasks, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveDataToStorage('announcements', announcements);
    }
  }, [announcements, isInitialized]);

  const calculateProgress = () => {
    // Get all unique users from activities and reports
    const allUsers = new Set<string>();
    activities.forEach(activity => allUsers.add(activity.createdBy));
    reports.forEach(report => allUsers.add(report.createdBy));
    tasks.forEach(task => allUsers.add(task.assignedTo));

    // Add all registered users to ensure they appear in progress
    users.forEach(user => allUsers.add(user.name));

    // Calculate individual user progress
    const newUserProgress: UserProgress[] = Array.from(allUsers).map(userName => {
      const userActivities = activities.filter(a => a.createdBy === userName && a.status === 'approved');
      const userReports = reports.filter(r => r.createdBy === userName && r.status === 'approved');
      const userTasksCompleted = tasks.filter(t => t.assignedTo === userName && t.status === 'completed');
      
      // Get user's bidang from user data or activities/reports
      const userData = users.find(u => u.name === userName);
      const userBidang = userData?.bidang || userActivities[0]?.bidang || userReports[0]?.bidang || 'Tidak Diketahui';
      
      // Calculate progress percentage (max 100%)
      // Formula: (activities * 15) + (reports * 25) + (completed tasks * 10)
      const activityPoints = Math.min(userActivities.length * 15, 60); // Max 60% from activities
      const reportPoints = Math.min(userReports.length * 25, 75); // Max 75% from reports
      const taskPoints = Math.min(userTasksCompleted.length * 10, 30); // Max 30% from tasks
      
      const totalPoints = activityPoints + reportPoints + taskPoints;
      const progressPercentage = Math.min(totalPoints, 100);

      const lastActivity = userActivities.length > 0 
        ? userActivities[userActivities.length - 1].createdAt 
        : userReports.length > 0 
          ? userReports[userReports.length - 1].createdAt 
          : '';

      return {
        userId: userName,
        userName,
        bidang: userBidang,
        activitiesCount: userActivities.length,
        reportsCount: userReports.length,
        tasksCompleted: userTasksCompleted.length,
        progressPercentage,
        lastActivity
      };
    });

    setUserProgress(newUserProgress);

    // Calculate bidang progress
    const bidangMap = new Map<string, UserProgress[]>();
    newUserProgress.forEach(user => {
      if (!bidangMap.has(user.bidang)) {
        bidangMap.set(user.bidang, []);
      }
      bidangMap.get(user.bidang)!.push(user);
    });

    const newBidangProgress: BidangProgress[] = Array.from(bidangMap.entries()).map(([bidang, users]) => {
      const totalMembers = users.length;
      const activitiesCount = users.reduce((sum, user) => sum + user.activitiesCount, 0);
      const reportsCount = users.reduce((sum, user) => sum + user.reportsCount, 0);
      const averageProgress = totalMembers > 0 
        ? Math.round(users.reduce((sum, user) => sum + user.progressPercentage, 0) / totalMembers)
        : 0;
      const completionRate = totalMembers > 0
        ? Math.round((users.filter(user => user.progressPercentage >= 70).length / totalMembers) * 100)
        : 0;

      return {
        bidang,
        totalMembers,
        activitiesCount,
        reportsCount,
        averageProgress,
        completionRate
      };
    });

    setBidangProgress(newBidangProgress);
  };

  const addUser = (userData: Omit<User, 'profilePhoto'>) => {
    const newUser: User = {
      ...userData,
      profilePhoto: undefined
    };
    setUsers(prev => {
      const updated = [...prev, newUser];
      console.log('👤 User added:', newUser.name);
      return updated;
    });
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => {
      const updated = prev.map(user => 
        user.nrp === updatedUser.nrp ? updatedUser : user
      );
      console.log('👤 User updated:', updatedUser.name);
      return updated;
    });
  };

  const deleteUser = (nrp: string) => {
    setUsers(prev => {
      const updated = prev.filter(user => user.nrp !== nrp);
      console.log('👤 User deleted:', nrp);
      return updated;
    });
  };

  const addActivity = (activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => {
      const updated = [newActivity, ...prev];
      console.log('📝 Activity added:', newActivity.title);
      return updated;
    });
  };

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReports(prev => {
      const updated = [newReport, ...prev];
      console.log('📊 Report added:', newReport.title);
      return updated;
    });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => {
      const updated = [newTask, ...prev];
      console.log('✅ Task added:', newTask.title);
      return updated;
    });
  };

  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `announcement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => {
      const updated = [newAnnouncement, ...prev];
      console.log('📢 Announcement added:', newAnnouncement.title);
      return updated;
    });
  };

  const updateActivityStatus = (id: string, status: 'approved' | 'rejected', validatedBy: string) => {
    setActivities(prev => {
      const updated = prev.map(activity => 
        activity.id === id 
          ? {
              ...activity,
              status,
              validatedBy,
              validatedAt: new Date().toISOString().split('T')[0]
            }
          : activity
      );
      console.log('📝 Activity status updated:', id, status);
      return updated;
    });
  };

  const updateReportStatus = (id: string, status: 'approved' | 'rejected', validatedBy: string) => {
    setReports(prev => {
      const updated = prev.map(report => 
        report.id === id 
          ? {
              ...report,
              status,
              validatedBy,
              validatedAt: new Date().toISOString().split('T')[0]
            }
          : report
      );
      console.log('📊 Report status updated:', id, status);
      return updated;
    });
  };

  const updateTaskStatus = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    setTasks(prev => {
      const updated = prev.map(task => 
        task.id === id ? { ...task, status } : task
      );
      console.log('✅ Task status updated:', id, status);
      return updated;
    });
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => {
      const updated = prev.filter(activity => activity.id !== id);
      console.log('📝 Activity deleted:', id);
      return updated;
    });
  };

  const deleteReport = (id: string) => {
    setReports(prev => {
      const updated = prev.filter(report => report.id !== id);
      console.log('📊 Report deleted:', id);
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const updated = prev.filter(task => task.id !== id);
      console.log('✅ Task deleted:', id);
      return updated;
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => {
      const updated = prev.filter(announcement => announcement.id !== id);
      console.log('📢 Announcement deleted:', id);
      return updated;
    });
  };

  const getUserProgress = (userName: string): UserProgress | null => {
    return userProgress.find(up => up.userName === userName) || null;
  };

  const getBidangProgress = (bidang: string): BidangProgress | null => {
    return bidangProgress.find(bp => bp.bidang === bidang) || null;
  };

  const getOverallStats = () => {
    const totalActivities = activities.filter(a => a.status === 'approved').length;
    const totalReports = reports.filter(r => r.status === 'approved').length;
    const totalTasks = tasks.filter(t => t.status === 'completed').length;
    const averageProgress = userProgress.length > 0
      ? Math.round(userProgress.reduce((sum, user) => sum + user.progressPercentage, 0) / userProgress.length)
      : 0;
    const activeMembers = userProgress.filter(user => user.progressPercentage > 0).length;

    return {
      totalActivities,
      totalReports,
      totalTasks,
      averageProgress,
      activeMembers
    };
  };

  const syncData = () => {
    console.log('🔄 Manual sync triggered');
    initializeUsersData();
    loadDataFromStorage();
    updateSyncTime();
  };

  const forceRefresh = () => {
    console.log('🔄 Force refresh triggered');
    window.location.reload();
  };

  return (
    <DataContext.Provider value={{
      users,
      activities,
      reports,
      tasks,
      announcements,
      userProgress,
      bidangProgress,
      isOnline,
      lastSyncTime,
      addUser,
      updateUser,
      deleteUser,
      addActivity,
      addReport,
      addTask,
      addAnnouncement,
      updateActivityStatus,
      updateReportStatus,
      updateTaskStatus,
      deleteActivity,
      deleteReport,
      deleteTask,
      deleteAnnouncement,
      getUserProgress,
      getBidangProgress,
      getOverallStats,
      syncData,
      forceRefresh
    }}>
      {children}
    </DataContext.Provider>
  );
};