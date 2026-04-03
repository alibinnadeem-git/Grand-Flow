export type UserRole = 
  | 'CSD_SITE' 
  | 'ACCOUNTS' 
  | 'COMPLIANCE' 
  | 'CSD_HEAD' 
  | 'DIR_OPS' 
  | 'CEO' 
  | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dept: string;
}

export type CaseStatus = 
// ... existing statuses
  | 'DRAFT' 
  | 'INITIATED' 
  | 'PENDING_ACCOUNTS' 
  | 'ACCOUNTS_VERIFIED' 
  | 'PENDING_COMPLIANCE' 
  | 'COMPLIANCE_REVIEWED' 
  | 'PENDING_DEPT_HEAD' 
  | 'DEPT_HEAD_REVIEWED' 
  | 'COMPLIANCE_PENDING' 
  | 'COMPLIANCE_CONFIRMED' 
  | 'PENDING_DIR_OPS' 
  | 'DIR_OPS_SIGNED' 
  | 'PENDING_CEO' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'SENT_TO_IMD' 
  | 'SENT_TO_EXECUTION' 
  | 'CUSTOMER_INFORMED' 
  | 'CLOSED';

export interface WorkflowStage {
  id: number;
  name: string;
  dept: string;
  status: CaseStatus;
  isGate?: boolean;
  isFinal?: boolean;
}

export interface Remark {
  id: string;
  author: string;
  role: string;
  dept: string;
  text: string;
  timestamp: string;
  action: string;
}

export interface Case {
  id: string;
  caseNo: string;
  subject: string;
  type: 'REALLOCATION' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  currentStageId: number;
  status: CaseStatus;
  complianceConfirmed: boolean;
  customerInformed: boolean;
  initiator: string;
  createdAt: string;
  customer: {
    name: string;
    cnic: string;
    phone: string;
  };
  property: {
    block: string;
    phase: string;
    plotNo: string;
    size: string;
  };
  financials: {
    netPrice: number;
    received: number;
    outstanding: number;
    ledgerVerified: boolean;
  };
  remarks: Remark[];
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: 1, name: 'Case Initiation', dept: 'CSD Site', status: 'INITIATED' },
  { id: 2, name: 'Accounts Verification', dept: 'Accounts HQ', status: 'PENDING_ACCOUNTS' },
  { id: 3, name: 'Compliance Audit', dept: 'Compliance', status: 'PENDING_COMPLIANCE' },
  { id: 4, name: 'CSD Head Review', dept: 'CSD HQ', status: 'PENDING_DEPT_HEAD' },
  { id: 5, name: 'Compliance Gate', dept: 'Compliance', status: 'COMPLIANCE_PENDING', isGate: true },
  { id: 6, name: 'Director Ops Review', dept: 'Exec Office', status: 'PENDING_DIR_OPS' },
  { id: 7, name: 'CEO Final Approval', dept: 'CEO Office', status: 'PENDING_CEO', isFinal: true },
  { id: 8, name: 'Execution Routing', dept: 'Ops/IMD', status: 'APPROVED' },
  { id: 9, name: 'Customer Intimation', dept: 'CSD', status: 'CUSTOMER_INFORMED' },
  { id: 10, name: 'Case Closure', dept: 'Admin', status: 'CLOSED' },
];
