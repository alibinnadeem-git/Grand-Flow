import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { WORKFLOW_STAGES } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'grand-flow-secret-key-2026';

// Mock Users Database
const USERS = [
  { id: 'u1', name: 'Ali Khan', email: 'site@grandcity.com', password: 'password123', role: 'CSD_SITE', dept: 'CSD Site' },
  { id: 'u2', name: 'Zohaib Hassan', email: 'accounts@grandcity.com', password: 'password123', role: 'ACCOUNTS', dept: 'Accounts HQ' },
  { id: 'u3', name: 'Sara Ahmed', email: 'compliance@grandcity.com', password: 'password123', role: 'COMPLIANCE', dept: 'Compliance' },
  { id: 'u4', name: 'Zaman Khan', email: 'head@grandcity.com', password: 'password123', role: 'CSD_HEAD', dept: 'CSD HQ' },
  { id: 'u5', name: 'Director Ops', email: 'ops@grandcity.com', password: 'password123', role: 'DIR_OPS', dept: 'Exec Office' },
  { id: 'u6', name: 'CEO', email: 'ceo@grandcity.com', password: 'password123', role: 'CEO', dept: 'CEO Office' },
];

interface AuthRequest extends Request {
  user?: any;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
      next();
    };
  };

  // In-memory "Database"
  let cases = [
    {
      id: 'case_1',
      caseNo: 'GC-CSD-2026-0042',
      subject: 'Plot Reallocation Request - Block A to Block C',
      type: 'REALLOCATION',
      priority: 'HIGH',
      currentStageId: 4,
      status: 'PENDING_DEPT_HEAD',
      complianceConfirmed: false,
      customerInformed: false,
      initiator: 'Ali Khan (CSD Site)',
      createdAt: new Date().toISOString(),
      customer: {
        name: 'Ahmad Shahzad',
        cnic: '42101-1234567-1',
        phone: '+92 300 1234567',
      },
      property: {
        block: 'A',
        phase: '2',
        plotNo: '442',
        size: '10 Marla',
      },
      financials: {
        netPrice: 4500000,
        received: 4500000,
        outstanding: 0,
        ledgerVerified: true,
      },
      remarks: [
        {
          id: 'rem_2',
          author: 'Sara Ahmed',
          role: 'Compliance Officer',
          dept: 'Compliance',
          text: 'Policy audit completed. All documents are in order.',
          timestamp: '2026-04-01T14:30:00Z',
          action: 'REVIEWED',
        }
      ]
    }
  ];

  // Auth Endpoints
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = USERS.find(u => u.email === email && u.password === password);

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role, dept: user.dept }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ id: user.id, name: user.name, role: user.role, dept: user.dept });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  app.get('/api/auth/me', authenticate, (req: AuthRequest, res) => {
    res.json(req.user);
  });

  // Case Operations
  app.get('/api/cases', authenticate, (req, res) => {
    res.json(cases);
  });

  app.get('/api/cases/:id', authenticate, (req, res) => {
    const c = cases.find(item => item.id === req.params.id);
    if (!c) return res.status(404).json({ error: 'Case not found' });
    res.json(c);
  });

  app.post('/api/cases/:id/remarks', authenticate, (req: AuthRequest, res) => {
    const { text, action } = req.body;
    const caseIndex = cases.findIndex(c => c.id === req.params.id);
    if (caseIndex === -1) return res.status(404).json({ error: 'Case not found' });

    const newRemark = {
      id: uuidv4(),
      author: req.user.name,
      role: req.user.role,
      dept: req.user.dept,
      text,
      timestamp: new Date().toISOString(),
      action: action || 'COMMENTED'
    };

    cases[caseIndex].remarks = [newRemark, ...cases[caseIndex].remarks];
    res.status(201).json(newRemark);
  });

  app.patch('/api/cases/:id/compliance', authenticate, authorize(['COMPLIANCE', 'ADMIN']), (req, res) => {
    const { confirmed } = req.body;
    const caseIndex = cases.findIndex(c => c.id === req.params.id);
    if (caseIndex === -1) return res.status(404).json({ error: 'Case not found' });

    cases[caseIndex].complianceConfirmed = confirmed;
    res.json(cases[caseIndex]);
  });

  app.patch('/api/cases/:id/move', authenticate, (req: AuthRequest, res) => {
    const caseIndex = cases.findIndex(c => c.id === req.params.id);
    if (caseIndex === -1) return res.status(404).json({ error: 'Case not found' });

    const currentCase = cases[caseIndex];
    const userRole = req.user.role;

    // RBAC for Movement
    const stage = WORKFLOW_STAGES.find(s => s.id === currentCase.currentStageId);
    
    // Simple role mapping for stages
    const roleMapping: Record<number, string[]> = {
      1: ['CSD_SITE', 'ADMIN'],
      2: ['ACCOUNTS', 'ADMIN'],
      3: ['COMPLIANCE', 'ADMIN'],
      4: ['CSD_HEAD', 'ADMIN'],
      5: ['COMPLIANCE', 'ADMIN'],
      6: ['DIR_OPS', 'ADMIN'],
      7: ['CEO', 'ADMIN'],
    };

    if (currentCase.currentStageId <= 7 && !roleMapping[currentCase.currentStageId].includes(userRole)) {
      return res.status(403).json({ error: `Only ${roleMapping[currentCase.currentStageId].join(' or ')} can move the case from this stage.` });
    }

    // Business Logic: Compliance Gate
    if (currentCase.currentStageId === 5 && !currentCase.complianceConfirmed) {
      return res.status(400).json({ error: 'Compliance Completion Check must be confirmed before proceeding.' });
    }

    const nextStageId = currentCase.currentStageId + 1;
    if (nextStageId > 10) return res.status(400).json({ error: 'Case is at final stage.' });

    currentCase.currentStageId = nextStageId;
    res.json(currentCase);
  });

  // Vite Integration ...
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
