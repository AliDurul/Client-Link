/* -------------------------- Shared -------------------------- */

/* Pagination */
export type Pagination<T> = {
  success: boolean;
  details: {
    limit: number;
    page: number;
    totalRecords: number;
    pages: {
      previous: boolean;
      current: number;
      next: number | boolean;
      total: number;
    } | false;
  };
  result: T[];
}

export interface ApiResponse extends Pagination<any> {
  error?: any;
}

export interface IUseActionInitVal {
  success: boolean;
  message: string;
  // errors?: Record<string, string[]>;
  // inputs?: Record<string, string>;
}

export type PageSearchParams = { searchParams: Promise<{ [key: string]: string | undefined }> }

export type PageParams = { params: Promise<{ [key: string]: string }> }

/* -------------------------- Pages -------------------------- */

/* Authorization */
export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}


/* TIKCET */
export interface Ticket {
  ticket_id: string;
  title: string;
  description: string;
  status: string;
  client_phonenumber: number | TicketClientPhoneNumber | null;
  caller_email: string | TicketClientPhoneNumber | null;
  caller_phonenumber: string | null;
  email_id: string | null;
  priority: string;
  flag: string;
  cat: number | { _id: number; title: string; };
  assigned_agent: { _id: string; first_name: string; last_name: string; email: string, phone_number: string, profile_pic: string };
  escalation: null | EscalationForm;
  timestamp: string;
  last_updated: string | null;
}

export interface EscalationForm {
  _id: number;
  escalated_at: Date;
  raised_by: number | { _id: number; first_name: string; last_name: string; email: string; phone_number: string };
  reason: string;
}

export interface TicketClientPhoneNumber { first_name: string, last_name: string, _id: number, phone_number: string }

export interface TicketComments {
  _id: string;
  title: string;
  comments: Comment[];
}

export interface Comment {
  _id: number;
  user: User;
  ticket: string;
  // title: string;
  body: string;
  timestamp: Date;
  last_updated: null | Date;
}

export interface User {
  first_name: string;
  last_name: string;
  phone_number: string | null;
}

export interface TicketStatuses {
  total_count: number;
  status_counts: StatusCounts;
}

export interface StatusCounts {
  Pending: number;
  Active: number;
  Resolved: number;
  Cancelled: number;
  Escalated: number;
}

/* INVOICE */

export interface Invoice {
  _id: string;
  creator: InvoicePerson;
  customer: InvoicePerson;
  invoice_items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'closed' | 'refunded';
  shipping_cost: number;
  discount: number;
  tax: number;
  due_date: string;
  payment_type: 'cash' | 'credit card' | 'bank transfer' | 'paypal' | 'stripe' | 'mobile' | 'debit card' | 'cheque';
  additional_note?: string;
  subtotal: number;
  total_amount: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface InvoiceItem {
  product: {
    _id: number | string;
    name: string;
  };
  quantity: number;
  discount: number;
  unit_price: number;
  total_price: number;
}

export interface InvoicePerson {
  _id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  profile_pic: string | null;
}




/* KYC */
export interface Kyc {
  _id: number;
  customer_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone_number: string;
  nationality?: string;
  dob?: Date;
  gender?: 'male' | 'female' | 'other';
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
  };
  id_type?: 'passport' | 'national_id' | 'driving_license' | 'other';
  id_number?: string;
  id_front?: string;
  id_back?: string;
  profession?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
  religion?: string;
  father_name?: string;
  mother_name?: string;
  witness_name?: string;
  witness_relation?: string;
  medication?: boolean;
  medication_type?: string;
  number_of_children?: number;
  boys?: number;
  girls?: number;
  finincial_institution?: string;
  documents?: string[];
  profile_pic?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  notes?: string;
  assigned_agent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/* COPARATE */
export interface Coparate {
  _id: number;
  name: string;
  courier: string;
  email: string;
  province: string;
  exact_location: string;
  mobile_number: string;
  created_at: Date;
  updated_at: Date;
}


/* PRODUCT */
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  _id: number;
  cover: string;
  title: string;
  timestamp: Date;
  updated: Date;
}

export interface ProductDefaultParams {
  _id?: number | null;
  name: string;
  description: string;
  price: number | string;
}

export interface Author {
  _id: number;
  first_name: string;
  last_name: string;
  phone_number: null;
  email: string;
  location: string;
}

export type ProductTableProp = {
  filteredItems: Product[],
  deleteProduct: (ProductId: number) => void,
  editProduct: (product: Product) => void
}

/* FAQ */
export interface Faq {
  _id?: number;
  question: string;
  answer: string;
}

/* EMAIL */
export interface Email {
  "@odata.etag": string;
  _id: string;
  type: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: string[];
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  subject: string;
  bodyPreview: string;
  importance: string;
  parentFolderId: string;
  conversationId: string;
  conversationIndex: string;
  isDeliveryReceiptRequested: boolean;
  isReadReceiptRequested: boolean;
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  inferenceClassification: string;
  body: Body;
  sender: Sender;
  from: From;
  toRecipients: ToRecipient[];
  ccRecipients: any[];
  bccRecipients: any[];
  replyTo: any[];
  flag: Flag;
}

interface Flag {
  flagStatus: string;
}

export interface ToRecipient {
  emailAddress: {
    name: string;
    address: string;
  };
}

interface From {
  emailAddress: EmailAddress1;
}

interface EmailAddress1 {
  name: string;
  address: string;
}

interface Sender {
  emailAddress: EmailAddress;
}

interface EmailAddress {
  name: string;
  address: string;
}

interface Body {
  contentType: string;
  content: string;
}

export interface Folder {
  _id: string,
  displayName: string,
  parentFolderId: string,
  childFolderCount: number,
  unreadItemCount: number,
  totalItemCount: number,
  isHidden: boolean
}


/* TASK */
export interface Task {
  _id: number;
  title: string;
  assigned_agent: AsignAgent;
  description: string;
  priority: string;
  status: string;
  created_at: Date;
}

export interface AsignAgent {
  _id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  profile_pic: string;
}

/* CHAT START */
export interface Chat {
  _id: number;
  chat_name: string;
  chat_picture: null | string
  is_group_chat: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  group_admin: null | number
  chat_users: ChatUser[];
  letestMessage: LetestMessage;
  groupAdmin: null | GroupAdmin;
}

export interface ChatDetail {
  isError: boolean;
  selectedChat: Chat;
  messages: Message[];
}

export interface ChatUser {
  _id: number;
  first_name: string;
  last_name: string;
  phone_number: null;
  email: string;
  profile_pic: null;
}

export interface LetestMessage {
  _id: number;
  content: string;
  created_at: Date;
}

export interface GroupAdmin {
  _id: number;
  first_name: string;
  last_name: string;
  phone_number: null | string;
  email: string;
  profile_pic: null | string;
}

export interface Message {
  _id: number;
  content: string;
  chat: number;
  sender: number,
  image: null | string;
  video: null | string;
  created_at: Date;
}

export interface MessageNotification {
  _id: number;
  content: string;
  senderId: number;
  chatId: number;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: null;
  isGroupChat: boolean;
  chatPicture: null | string;
  chatName: null | string;
  sender: MsgSender;
}

export interface MsgSender {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  phoneNo: string;
  role: number;
}

/* Leads */
export interface ILead {
  _id?: number;
  source: null | string;
  owner: null | string;
  name: null | string;
  source_link: null | string;
  courier: 'Yes' | 'No';
  mobile_number: null | string;
  email: null | string;
  province: null | string;
  town: null | string;
  exact_location: null | string;
  pipeline_stage: EPipelineStage;
  deal_value: string;
  probability: string;
  expected_revenue: string;
  follow_up_date: Date;
  close_date: null | Date;
  status: ELeadStatus;
  comments: null | string;
}

export enum EPipelineStage {
  Qualification = 'Qualification',
  ProposalQuotation = 'Proposal|Quotation',
  Negotiation = 'Negotiation',
  PendingApproval = 'Pending Approval',
  ClosedWon = 'Closed-Won',
  ClosedLost = 'Closed-Lost'
}

export enum ELeadStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  ClosedWon = 'Closed-Won',
  ClosedLost = 'Closed-Lost',
}
