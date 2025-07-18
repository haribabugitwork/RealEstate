import React, { useState } from 'react';
import { 
  User, 
  Home, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Plus, 
  Search,
  Filter,
  DollarSign,
  MapPin,
  X,
  Check,
  AlertCircle,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Settings,
  MoreVertical,
  Activity,
  Users
} from 'lucide-react';

const TenantDetails = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [checkAction, setCheckAction] = useState('');
  const [activeView, setActiveView] = useState('dashboard');

  // Helper functions
  const getMonthsBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
    
    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const finalDate = new Date(end.getFullYear(), end.getMonth(), 1);
    
    while (current <= finalDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Generate payment history for each tenant
  const generatePaymentHistory = (tenant) => {
    const months = getMonthsBetween(tenant.leaseStart, new Date());
    const today = new Date();
    
    return months.map((month, index) => {
      const dueDate = new Date(month.getFullYear(), month.getMonth(), 15);
      const isOverdue = today > dueDate;
      const daysPastDue = isOverdue ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;
      
      const existingPayment = tenant.payments && tenant.payments.find(p => 
        new Date(p.dueDate).getMonth() === month.getMonth() && 
        new Date(p.dueDate).getFullYear() === month.getFullYear()
      );

      if (existingPayment) {
        return existingPayment;
      }

      let status = 'pending';
      let paidDate = null;
      let paymentMethod = null;
      let remarks = '';

      if (month < new Date(today.getFullYear(), today.getMonth(), 1)) {
        if (tenant.id === 1) {
          status = Math.random() > 0.1 ? 'paid' : 'overdue';
        } else if (tenant.id === 2) {
          status = Math.random() > 0.2 ? 'paid' : 'overdue';
        } else if (tenant.id === 4) {
          status = Math.random() > 0.4 ? 'paid' : 'overdue';
        } else {
          status = Math.random() > 0.15 ? 'paid' : 'overdue';
        }

        if (status === 'paid') {
          const payDay = Math.floor(Math.random() * 20) + 1;
          paidDate = formatDate(new Date(month.getFullYear(), month.getMonth(), payDay));
          paymentMethod = ['bank_transfer', 'check', 'cash'][Math.floor(Math.random() * 3)];
        }
      } else if (month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear()) {
        if (today.getDate() > 15) {
          status = isOverdue ? 'overdue' : 'pending';
        }
      }

      return {
        id: `${tenant.id}-${month.getFullYear()}-${month.getMonth()}`,
        month: getMonthName(month),
        dueDate: formatDate(dueDate),
        amount: tenant.monthlyRent,
        status,
        paidDate,
        paymentMethod,
        daysPastDue: status === 'overdue' ? daysPastDue : 0,
        remarks,
        lateFee: status === 'overdue' && daysPastDue > 5 ? Math.min(daysPastDue * 10, 200) : 0
      };
    });
  };

  // Sample tenant data
  const [tenants, setTenants] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      propertyName: "Luxury Penthouse",
      propertyAddress: "321 Skyline Drive, Uptown",
      monthlyRent: 3500,
      cautionDeposit: 7000,
      leaseStart: "2024-01-15",
      leaseEnd: "2024-12-31",
      status: "active",
      paymentStatus: "current",
      avatar: "JS",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      payments: [
        {
          id: 1,
          month: "July 2024",
          dueDate: "2024-07-15",
          amount: 3500,
          status: "paid",
          paidDate: "2024-07-12",
          paymentMethod: "bank_transfer",
          daysPastDue: 0,
          remarks: "Paid early via online transfer",
          lateFee: 0
        }
      ],
      checks: [
        {
          id: 1,
          checkNumber: "1001",
          amount: 3500,
          dueDate: "2024-01-15",
          status: "realized",
          realizedDate: "2024-01-16",
          remarks: "Cleared successfully"
        },
        {
          id: 2,
          checkNumber: "1002",
          amount: 3500,
          dueDate: "2024-02-15",
          status: "pending",
          remarks: ""
        }
      ],
      documents: [
        {
          id: 1,
          name: "Lease Agreement.pdf",
          type: "lease",
          uploadDate: "2024-01-10",
          size: "245 KB"
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 987-6543",
      propertyName: "Family Home",
      propertyAddress: "654 Elm Street, Family District",
      monthlyRent: 2800,
      cautionDeposit: 5600,
      leaseStart: "2024-03-01",
      leaseEnd: "2025-02-28",
      status: "active",
      paymentStatus: "current",
      avatar: "SJ",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      payments: [],
      checks: [
        {
          id: 6,
          checkNumber: "2001",
          amount: 2800,
          dueDate: "2024-03-01",
          status: "realized",
          realizedDate: "2024-03-02",
          remarks: "First month rent"
        }
      ],
      documents: [
        {
          id: 3,
          name: "Rental Agreement.pdf",
          type: "lease",
          uploadDate: "2024-02-25",
          size: "312 KB"
        }
      ]
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "(555) 456-7890",
      propertyName: "Downtown Condo",
      propertyAddress: "789 Business Plaza, Downtown",
      monthlyRent: 1600,
      cautionDeposit: 3200,
      leaseStart: "2024-02-01",
      leaseEnd: "2025-01-31",
      status: "active",
      paymentStatus: "current",
      avatar: "MC",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      payments: [],
      checks: [
        {
          id: 10,
          checkNumber: "3001",
          amount: 1600,
          dueDate: "2024-02-01",
          status: "realized",
          realizedDate: "2024-02-02",
          remarks: "First payment",
          bankName: "Wells Fargo"
        },
        {
          id: 11,
          checkNumber: "3002",
          amount: 1600,
          dueDate: "2024-03-01",
          status: "pending",
          remarks: "",
          bankName: "Wells Fargo"
        },
        {
          id: 12,
          checkNumber: "3003",
          amount: 1600,
          dueDate: "2024-04-01",
          status: "pending",
          remarks: "",
          bankName: "Wells Fargo"
        }
      ],
      documents: []
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "(555) 234-5678",
      propertyName: "Lakeside Apartment",
      propertyAddress: "321 Lake View Drive, Lakeside",
      monthlyRent: 1400,
      cautionDeposit: 2800,
      leaseStart: "2024-04-01",
      leaseEnd: "2025-03-31",
      status: "expiring",
      paymentStatus: "overdue",
      avatar: "ER",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      payments: [],
      checks: [
        {
          id: 8,
          checkNumber: "3001",
          amount: 1400,
          dueDate: "2024-04-01",
          status: "bounced",
          bouncedDate: "2024-04-03",
          remarks: "Account closed",
          bounceReason: "Account Closed"
        }
      ],
      documents: [
        {
          id: 4,
          name: "Original Lease.pdf",
          type: "lease",
          uploadDate: "2024-03-28",
          size: "198 KB"
        }
      ]
    }
  ]);

  // Form states
  const [uploadForm, setUploadForm] = useState({
    file: null,
    documentType: '',
    description: ''
  });

  const [checkUpdateForm, setCheckUpdateForm] = useState({
    remarks: '',
    bounceReason: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: '',
    paidDate: new Date().toISOString().split('T')[0],
    remarks: '',
    selectedMonth: '',
    selectedTenantId: '',
    // Post-dated cheque management
    isPostDatedCheque: false,
    selectedChequeId: '',
    chequeAction: '' // 'realize' or 'bounce'
  });

  // Constants
  const documentTypes = [
    { value: 'lease', label: 'Lease Agreement' },
    { value: 'receipt', label: 'Payment Receipt' },
    { value: 'insurance', label: 'Insurance Document' },
    { value: 'identity', label: 'Identity Proof' },
    { value: 'income', label: 'Income Proof' },
    { value: 'other', label: 'Other Document' }
  ];

  const bounceReasons = [
    { value: 'NSF', label: 'Non-Sufficient Funds' },
    { value: 'Account Closed', label: 'Account Closed' },
    { value: 'Stop Payment', label: 'Stop Payment' },
    { value: 'Invalid Signature', label: 'Invalid Signature' },
    { value: 'Stale Dated', label: 'Stale Dated' },
    { value: 'Other', label: 'Other Reason' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'online', label: 'Online Payment' }
  ];

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const openUploadModal = (tenant) => {
    setSelectedTenant(tenant);
    setShowUploadModal(true);
    setUploadForm({ file: null, documentType: '', description: '' });
    setUploadStatus(null);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedTenant(null);
    setUploadForm({ file: null, documentType: '', description: '' });
    setUploadStatus(null);
  };

  const openCheckModal = (tenant, check, action) => {
    setSelectedTenant(tenant);
    setSelectedCheck(check);
    setCheckAction(action);
    setShowCheckModal(true);
    setCheckUpdateForm({ remarks: '', bounceReason: '' });
    setUploadStatus(null);
  };

  const closeCheckModal = () => {
    setShowCheckModal(false);
    setSelectedTenant(null);
    setSelectedCheck(null);
    setCheckAction('');
    setCheckUpdateForm({ remarks: '', bounceReason: '' });
    setUploadStatus(null);
  };

  const openPaymentModal = (tenant, monthData = null) => {
    setSelectedTenant(tenant);
    setShowPaymentModal(true);
    setPaymentForm({
      amount: monthData ? monthData.amount.toString() : (tenant ? tenant.monthlyRent.toString() : ''),
      paymentMethod: '',
      paidDate: new Date().toISOString().split('T')[0],
      remarks: '',
      selectedMonth: monthData ? monthData.id : '',
      selectedTenantId: tenant ? tenant.id.toString() : '',
      // Post-dated cheque management
      isPostDatedCheque: false,
      selectedChequeId: '',
      chequeAction: ''
    });
    setUploadStatus(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedTenant(null);
    setPaymentForm({
      amount: '',
      paymentMethod: '',
      paidDate: new Date().toISOString().split('T')[0],
      remarks: '',
      selectedMonth: '',
      selectedTenantId: '',
      // Post-dated cheque management
      isPostDatedCheque: false,
      selectedChequeId: '',
      chequeAction: ''
    });
    setUploadStatus(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadForm(prev => ({ ...prev, file }));
  };

  const handleUploadFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckFormChange = (e) => {
    const { name, value } = e.target;
    setCheckUpdateForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = async () => {
    if (!uploadForm.file || !uploadForm.documentType) {
      setUploadStatus({ type: 'error', message: 'Please select a file and document type' });
      return;
    }

    try {
      setUploadStatus({ type: 'loading', message: 'Uploading document...' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument = {
        id: Date.now(),
        name: uploadForm.file.name,
        type: uploadForm.documentType,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(uploadForm.file.size / 1024).toFixed(0)} KB`,
        description: uploadForm.description
      };

      setTenants(prev => prev.map(tenant => 
        tenant.id === selectedTenant.id
          ? { ...tenant, documents: [...tenant.documents, newDocument] }
          : tenant
      ));

      setUploadStatus({ type: 'success', message: 'Document uploaded successfully!' });
      
      setTimeout(() => {
        closeUploadModal();
      }, 1500);

    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Failed to upload document. Please try again.' });
    }
  };

  const handleCheckUpdate = async () => {
    if (checkAction === 'bounced' && !checkUpdateForm.bounceReason) {
      setUploadStatus({ type: 'error', message: 'Please select a bounce reason' });
      return;
    }

    try {
      setUploadStatus({ type: 'loading', message: `Updating check status to ${checkAction}...` });
      await new Promise(resolve => setTimeout(resolve, 1500));

      const currentDate = new Date().toISOString().split('T')[0];
      const updatedCheck = {
        ...selectedCheck,
        status: checkAction,
        remarks: checkUpdateForm.remarks,
        ...(checkAction === 'realized' ? {
          realizedDate: currentDate
        } : {
          bouncedDate: currentDate,
          bounceReason: checkUpdateForm.bounceReason
        })
      };

      setTenants(prev => prev.map(tenant => 
        tenant.id === selectedTenant.id
          ? {
              ...tenant,
              checks: tenant.checks.map(check =>
                check.id === selectedCheck.id ? updatedCheck : check
              )
            }
          : tenant
      ));

      setUploadStatus({ 
        type: 'success', 
        message: `Check ${checkAction === 'realized' ? 'marked as realized' : 'marked as bounced'} successfully!` 
      });
      
      setTimeout(() => {
        closeCheckModal();
      }, 1500);

    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Failed to update check status. Please try again.' });
    }
  };

  const handlePaymentRecord = async () => {
    // Basic validation
    if (!paymentForm.selectedTenantId) {
      setUploadStatus({ type: 'error', message: 'Please select a tenant' });
      return;
    }

    if (paymentForm.isPostDatedCheque) {
      // Post-dated cheque management validation
      if (!paymentForm.selectedChequeId || !paymentForm.chequeAction) {
        setUploadStatus({ type: 'error', message: 'Please select a cheque and action to perform' });
        return;
      }
    } else {
      // Regular payment validation
      if (!paymentForm.amount || !paymentForm.paymentMethod || !paymentForm.paidDate) {
        setUploadStatus({ type: 'error', message: 'Please fill in all required payment fields' });
        return;
      }
    }

    try {
      setUploadStatus({ type: 'loading', message: paymentForm.isPostDatedCheque ? 'Updating cheque status...' : 'Recording payment...' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentForm.isPostDatedCheque) {
        // Update cheque status
        const currentDate = new Date().toISOString().split('T')[0];
        
        setTenants(prev => prev.map(tenant => 
          tenant.id.toString() === paymentForm.selectedTenantId
            ? {
                ...tenant,
                checks: tenant.checks.map(check =>
                  check.id.toString() === paymentForm.selectedChequeId
                    ? {
                        ...check,
                        status: paymentForm.chequeAction,
                        remarks: paymentForm.remarks,
                        ...(paymentForm.chequeAction === 'realized' ? {
                          realizedDate: currentDate
                        } : {
                          bouncedDate: currentDate,
                          bounceReason: paymentForm.remarks || 'Updated via payment management'
                        })
                      }
                    : check
                )
              }
            : tenant
        ));

        setUploadStatus({ 
          type: 'success', 
          message: `Cheque ${paymentForm.chequeAction === 'realized' ? 'realized' : 'bounced'} successfully!` 
        });
      } else {
        // Record regular payment
        setUploadStatus({ type: 'success', message: 'Payment recorded successfully!' });
      }
      
      setTimeout(() => {
        closePaymentModal();
      }, 2000);

    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Failed to process request. Please try again.' });
    }
  };

  const deleteDocument = (tenantId, documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setTenants(prev => prev.map(tenant => 
        tenant.id === tenantId
          ? { ...tenant, documents: tenant.documents.filter(doc => doc.id !== documentId) }
          : tenant
      ));
    }
  };

  // Filter tenants
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || tenant.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate payment statistics
  const getPaymentStats = (tenant) => {
    const paymentHistory = generatePaymentHistory(tenant);
    const totalDue = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPaid = paymentHistory.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const totalOverdue = paymentHistory.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amount + payment.lateFee, 0);
    const overdueCount = paymentHistory.filter(p => p.status === 'overdue').length;
    
    return {
      totalDue,
      totalPaid,
      totalOverdue,
      overdueCount,
      paymentHistory,
      collectionRate: totalDue > 0 ? ((totalPaid / totalDue) * 100).toFixed(1) : '100.0'
    };
  };

  // Badge components
  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'success', text: 'Active' },
      expiring: { bg: 'warning', text: 'Expiring Soon' },
      expired: { bg: 'danger', text: 'Expired' },
      terminated: { bg: 'secondary', text: 'Terminated' }
    };
    
    const badge = badges[status] || badges.active;
    return (
      <span className={`badge bg-${badge.bg} bg-opacity-10 text-${badge.bg} border border-${badge.bg} border-opacity-25`}>
        {badge.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      current: { bg: 'success', text: 'Current', icon: CheckCircle },
      overdue: { bg: 'danger', text: 'Overdue', icon: AlertTriangle },
      late: { bg: 'warning', text: 'Late', icon: Clock }
    };
    
    const badge = badges[status] || badges.current;
    const IconComponent = badge.icon;
    
    return (
      <span className={`badge bg-${badge.bg} bg-opacity-10 text-${badge.bg} border border-${badge.bg} border-opacity-25 d-inline-flex align-items-center gap-1`}>
        <IconComponent size={12} />
        {badge.text}
      </span>
    );
  };

  const getCheckStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'warning', text: 'Pending', icon: Clock },
      realized: { bg: 'success', text: 'Realized', icon: CheckCircle },
      bounced: { bg: 'danger', text: 'Bounced', icon: XCircle }
    };
    
    const badge = badges[status] || badges.pending;
    const IconComponent = badge.icon;
    
    return (
      <span className={`badge bg-${badge.bg} bg-opacity-10 text-${badge.bg} border border-${badge.bg} border-opacity-25 d-inline-flex align-items-center gap-1`}>
        <IconComponent size={12} />
        {badge.text}
      </span>
    );
  };

  const getPaymentEntryStatusBadge = (status) => {
    const badges = {
      paid: { bg: 'success', text: 'Paid', icon: CheckCircle },
      pending: { bg: 'warning', text: 'Pending', icon: Clock },
      overdue: { bg: 'danger', text: 'Overdue', icon: AlertTriangle },
      partial: { bg: 'info', text: 'Partial', icon: TrendingUp }
    };
    
    const badge = badges[status] || badges.pending;
    const IconComponent = badge.icon;
    
    return (
      <span className={`badge bg-${badge.bg} bg-opacity-10 text-${badge.bg} border border-${badge.bg} border-opacity-25 d-inline-flex align-items-center gap-1`}>
        <IconComponent size={12} />
        {badge.text}
      </span>
    );
  };

  const getDocumentIcon = (type) => {
    const icons = {
      lease: <FileText size={20} className="text-primary" />,
      receipt: <DollarSign size={20} className="text-success" />,
      insurance: <AlertCircle size={20} className="text-warning" />,
      identity: <User size={20} className="text-info" />,
      income: <FileText size={20} className="text-secondary" />,
      other: <FileText size={20} className="text-muted" />
    };
    return icons[type] || icons.other;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: <DollarSign size={16} className="text-success" />,
      check: <CreditCard size={16} className="text-primary" />,
      bank_transfer: <TrendingUp size={16} className="text-info" />,
      credit_card: <CreditCard size={16} className="text-warning" />,
      online: <TrendingUp size={16} className="text-secondary" />
    };
    return icons[method] || <DollarSign size={16} className="text-muted" />;
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Modern Header */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center py-4 px-4">
              <div>
                <h1 className="h2 fw-bold text-white mb-1">Property Management</h1>
                <p className="text-white-50 mb-0">Manage your tenants, payments, and properties</p>
              </div>
              <div className="d-flex gap-3">
                <button 
                  className={`btn ${activeView === 'dashboard' ? 'btn-light' : 'btn-outline-light'} d-flex align-items-center gap-2`}
                  onClick={() => setActiveView('dashboard')}
                >
                  <Activity size={18} />
                  Dashboard
                </button>
                <button 
                  className={`btn ${activeView === 'tenants' ? 'btn-light' : 'btn-outline-light'} d-flex align-items-center gap-2`}
                  onClick={() => setActiveView('tenants')}
                >
                  <Users size={18} />
                  Tenants
                </button>
                <button className="btn btn-outline-light d-flex align-items-center gap-2">
                  <Settings size={18} />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid px-4 pb-4">
                  {activeView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              <div className="col-xl-3 col-lg-6">
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="card-body p-4 text-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h3 className="fw-bold mb-1">
                          ${filteredTenants.reduce((sum, t) => sum + (getPaymentStats(t).totalPaid), 0).toLocaleString()}
                        </h3>
                        <p className="mb-0 opacity-75">Total Collected</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-3">
                        <TrendingUp size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <small className="text-white-50">+12% from last month</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-xl-3 col-lg-6">
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <div className="card-body p-4 text-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h3 className="fw-bold mb-1">
                          ${filteredTenants.reduce((sum, t) => sum + (getPaymentStats(t).totalOverdue), 0).toLocaleString()}
                        </h3>
                        <p className="mb-0 opacity-75">Total Overdue</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-3">
                        <AlertTriangle size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <small className="text-white-50">{filteredTenants.filter(t => t.paymentStatus === 'overdue').length} tenants affected</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-xl-3 col-lg-6">
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <div className="card-body p-4 text-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h3 className="fw-bold mb-1">
                          ${filteredTenants.reduce((sum, tenant) => sum + tenant.monthlyRent, 0).toLocaleString()}
                        </h3>
                        <p className="mb-0 opacity-75">Monthly Revenue</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-3">
                        <DollarSign size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <small className="text-white-50">Expected monthly income</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-xl-3 col-lg-6">
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                  <div className="card-body p-4 text-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h3 className="fw-bold mb-1">
                          {filteredTenants.length > 0 ? 
                            (filteredTenants.reduce((sum, t) => sum + parseFloat(getPaymentStats(t).collectionRate), 0) / filteredTenants.length).toFixed(1)
                            : '0.0'
                          }%
                        </h3>
                        <p className="mb-0 opacity-75">Collection Rate</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-3">
                        <CheckCircle size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <small className="text-white-50">Portfolio performance</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-4 mb-5">
              <div className="col-12">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Quick Actions</h5>
                    <div className="row g-3">
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <button 
                          className="btn btn-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                          style={{ borderRadius: '15px', minHeight: '120px' }}
                          onClick={() => openPaymentModal(null)}
                        >
                          <Plus size={32} className="mb-2" />
                          <span className="fw-semibold">Record Payment</span>
                          <small className="opacity-75">Add new payment</small>
                        </button>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <button 
                          className="btn btn-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                          style={{ borderRadius: '15px', minHeight: '120px' }}
                          onClick={() => setActiveView('tenants')}
                        >
                          <Users size={32} className="mb-2" />
                          <span className="fw-semibold">View Tenants</span>
                          <small className="opacity-75">Manage tenants</small>
                        </button>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <button 
                          className="btn btn-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                          style={{ borderRadius: '15px', minHeight: '120px' }}
                          onClick={() => {
                            if (tenants.length > 0) {
                              openUploadModal(tenants[0]);
                            } else {
                              setUploadStatus({ type: 'error', message: 'No tenants available. Please add tenants first.' });
                            }
                          }}
                        >
                          <Upload size={32} className="mb-2" />
                          <span className="fw-semibold">Upload Document</span>
                          <small className="opacity-75">Add contract docs</small>
                        </button>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <button 
                          className="btn btn-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                          style={{ borderRadius: '15px', minHeight: '120px' }}
                        >
                          <Activity size={32} className="mb-2" />
                          <span className="fw-semibold">Generate Report</span>
                          <small className="opacity-75">Export data</small>
                        </button>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <button 
                          className="btn btn-secondary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                          style={{ borderRadius: '15px', minHeight: '120px' }}
                        >
                          <CreditCard size={32} className="mb-2" />
                          <span className="fw-semibold">Manage Checks</span>
                          <small className="opacity-75">Track cheques</small>
                        </button>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <button 
                          className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                          style={{ borderRadius: '15px', minHeight: '120px' }}
                        >
                          <Settings size={32} className="mb-2" />
                          <span className="fw-semibold">Settings</span>
                          <small className="opacity-75">Configuration</small>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Expiry Alert */}
            <div className="row g-4 mb-5">
              <div className="col-12">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
                  <div className="card-body p-4 text-white">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h5 className="fw-bold mb-2 d-flex align-items-center">
                          <Calendar size={24} className="me-2" />
                          Contract Expiry Alert
                        </h5>
                        <p className="mb-0 opacity-90">
                          {filteredTenants.filter(t => {
                            const today = new Date();
                            const leaseEnd = new Date(t.leaseEnd);
                            const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                            return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                          }).length} contracts expiring within 90 days
                        </p>
                      </div>
                      <button 
                        className="btn btn-light fw-semibold"
                        onClick={() => setActiveView('tenants')}
                        style={{ borderRadius: '12px' }}
                      >
                        View Details
                      </button>
                    </div>
                    
                    {/* Expiring Contracts List */}
                    <div className="row g-3">
                      {filteredTenants
                        .filter(t => {
                          const today = new Date();
                          const leaseEnd = new Date(t.leaseEnd);
                          const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                          return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                        })
                        .slice(0, 3)
                        .map((tenant) => {
                          const today = new Date();
                          const leaseEnd = new Date(tenant.leaseEnd);
                          const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                          
                          return (
                            <div key={tenant.id} className="col-md-4">
                              <div className="bg-white bg-opacity-20 rounded-3 p-3">
                                <div className="d-flex align-items-center">
                                  <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                    style={{ 
                                      width: '40px', 
                                      height: '40px',
                                      background: 'rgba(255, 255, 255, 0.3)'
                                    }}
                                  >
                                    {tenant.avatar}
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="fw-semibold">{tenant.name}</div>
                                    <small className="opacity-75">{tenant.propertyName}</small>
                                    <div className="small">
                                      <span className={`badge ${daysUntilExpiry <= 30 ? 'bg-danger' : daysUntilExpiry <= 60 ? 'bg-warning' : 'bg-info'} bg-opacity-75`}>
                                        {daysUntilExpiry} days left
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-end">
                                    <small className="opacity-75">Expires</small>
                                    <div className="fw-semibold">{tenant.leaseEnd}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      
                      {filteredTenants.filter(t => {
                        const today = new Date();
                        const leaseEnd = new Date(t.leaseEnd);
                        const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                      }).length === 0 && (
                        <div className="col-12">
                          <div className="text-center py-3">
                            <CheckCircle size={48} className="mb-2 opacity-75" />
                            <p className="mb-0 opacity-90">All contracts are in good standing</p>
                            <small className="opacity-75">No contracts expiring in the next 90 days</small>
                          </div>
                        </div>
                      )}
                      
                      {filteredTenants.filter(t => {
                        const today = new Date();
                        const leaseEnd = new Date(t.leaseEnd);
                        const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                      }).length > 3 && (
                        <div className="col-md-4">
                          <div className="bg-white bg-opacity-20 rounded-3 p-3 text-center">
                            <div className="h-100 d-flex flex-column justify-content-center">
                              <div className="fw-semibold mb-1">
                                +{filteredTenants.filter(t => {
                                  const today = new Date();
                                  const leaseEnd = new Date(t.leaseEnd);
                                  const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                                  return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                                }).length - 3} more
                              </div>
                              <small className="opacity-75">contracts expiring</small>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue Payments Alert */}
            <div className="row g-4 mb-5">
              <div className="col-12">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' }}>
                  <div className="card-body p-4 text-white">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h5 className="fw-bold mb-2 d-flex align-items-center">
                          <AlertTriangle size={24} className="me-2" />
                          Overdue Payments Alert
                        </h5>
                        <p className="mb-0 opacity-90">
                          {filteredTenants.filter(t => t.paymentStatus === 'overdue').length} tenants have overdue payments requiring immediate attention
                        </p>
                      </div>
                      <button 
                        className="btn btn-light fw-semibold"
                        onClick={() => setActiveView('tenants')}
                        style={{ borderRadius: '12px' }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="row g-4">
              <div className="col-12">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold mb-0">Recent Payment Activity</h5>
                      <button 
                        className="btn btn-primary"
                        onClick={() => openPaymentModal(null)}
                        style={{ borderRadius: '12px' }}
                      >
                        <Plus size={16} className="me-2" />
                        Record Payment
                      </button>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Tenant</th>
                            <th>Property</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTenants.flatMap(tenant => 
                            getPaymentStats(tenant).paymentHistory
                              .filter(payment => payment.status === 'overdue' || payment.status === 'pending')
                              .slice(0, 2)
                              .map(payment => ({
                                ...payment,
                                tenant: tenant
                              }))
                          ).slice(0, 5).map((payment, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                    style={{ 
                                      width: '35px', 
                                      height: '35px',
                                      background: payment.tenant.gradient,
                                      fontSize: '12px'
                                    }}
                                  >
                                    {payment.tenant.avatar}
                                  </div>
                                  <div>
                                    <div className="fw-semibold">{payment.tenant.name}</div>
                                    <small className="text-muted">{payment.tenant.email}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{payment.tenant.propertyName}</td>
                              <td className="fw-bold">${payment.amount.toLocaleString()}</td>
                              <td>{getPaymentEntryStatusBadge(payment.status)}</td>
                              <td>{payment.dueDate}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => openPaymentModal(payment.tenant, payment)}
                                  style={{ borderRadius: '8px' }}
                                >
                                  Record Payment
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'tenants' && (
          <>
            {/* Search and Filter */}
            <div className="row g-4 mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                  <div className="card-body p-4">
                    <div className="row g-3 align-items-center">
                      <div className="col-md-6">
                        <div className="position-relative">
                          <Search size={20} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                          <input
                            type="text"
                            className="form-control form-control-lg ps-5 border-0 bg-light"
                            placeholder="Search tenants by name, email, or property..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ borderRadius: '15px' }}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex align-items-center">
                          <Filter size={20} className="me-2 text-muted" />
                          <select
                            className="form-select form-select-lg border-0 bg-light"
                            value={filterStatus}
                            onChange={handleFilterChange}
                            style={{ borderRadius: '15px' }}
                          >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expiring">Expiring Soon</option>
                            <option value="expired">Expired</option>
                            <option value="terminated">Terminated</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-end">
                          <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fs-6 px-3 py-2">
                            {filteredTenants.length} Total Tenants
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Cards Grid */}
            <div className="row g-4">
              {filteredTenants.map((tenant) => {
                const paymentStats = getPaymentStats(tenant);
                return (
                  <div key={tenant.id} className="col-xl-6 col-lg-12">
                    <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '20px' }}>
                      {/* Card Header */}
                      <div className="card-header border-0 bg-transparent p-4 pb-0">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                background: tenant.gradient,
                                fontSize: '18px'
                              }}
                            >
                              {tenant.avatar}
                            </div>
                            <div>
                              <h5 className="fw-bold mb-1">{tenant.name}</h5>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                {getStatusBadge(tenant.status)}
                                {getPaymentStatusBadge(tenant.paymentStatus)}
                              </div>
                              <div className="small text-muted d-flex align-items-center">
                                <MapPin size={14} className="me-1" />
                                {tenant.propertyName}
                              </div>
                            </div>
                          </div>
                          <div className="dropdown">
                            <button className="btn btn-link text-muted" data-bs-toggle="dropdown">
                              <MoreVertical size={20} />
                            </button>
                            <ul className="dropdown-menu">
                              <li><button className="dropdown-item" onClick={() => openPaymentModal(tenant)}>Record Payment</button></li>
                              <li><button className="dropdown-item" onClick={() => openUploadModal(tenant)}>Upload Document</button></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><button className="dropdown-item text-danger">Remove Tenant</button></li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="card-body p-4">
                        {/* Contact Info */}
                        <div className="row g-3 mb-4">
                          <div className="col-12">
                            <div className="d-flex align-items-center text-muted">
                              <Mail size={16} className="me-2" />
                              <span>{tenant.email}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex align-items-center text-muted">
                              <Phone size={16} className="me-2" />
                              <span>{tenant.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Stats */}
                        <div className="row g-3 mb-4">
                          <div className="col-6">
                            <div className="bg-light p-3 rounded-3 text-center">
                              <div className="fw-bold text-success fs-5">${tenant.monthlyRent}</div>
                              <small className="text-muted">Monthly Rent</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="bg-light p-3 rounded-3 text-center">
                              <div className={`fw-bold fs-5 ${paymentStats.totalOverdue > 0 ? 'text-danger' : 'text-success'}`}>
                                ${paymentStats.totalOverdue.toLocaleString()}
                              </div>
                              <small className="text-muted">Outstanding</small>
                            </div>
                          </div>
                        </div>

                        {/* Overdue Alert */}
                        {paymentStats.overdueCount > 0 && (
                          <div className="alert alert-warning border-0 rounded-3 mb-4" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                            <div className="d-flex align-items-center">
                              <AlertTriangle size={18} className="me-2" />
                              <div>
                                <strong>{paymentStats.overdueCount}</strong> overdue payment(s)
                                <div className="small">Total: ${paymentStats.totalOverdue.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Recent Activity */}
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3">Recent Activity</h6>
                          <div className="list-group list-group-flush">
                            {paymentStats.paymentHistory.slice(-3).reverse().map((payment) => (
                              <div key={payment.id} className="list-group-item border-0 px-0 py-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="fw-semibold small">{payment.month}</div>
                                    <div className="text-muted small">${payment.amount}</div>
                                  </div>
                                  <div>
                                    {getPaymentEntryStatusBadge(payment.status)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                            onClick={() => openPaymentModal(tenant)}
                            style={{ borderRadius: '12px' }}
                          >
                            <Plus size={16} />
                            Record Payment
                          </button>
                          <button 
                            className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                            onClick={() => openUploadModal(tenant)}
                            style={{ borderRadius: '12px', width: '50px', height: '40px' }}
                          >
                            <Upload size={16} />
                          </button>
                          <button 
                            className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                            onClick={() => setSelectedTenant(tenant)}
                            style={{ borderRadius: '12px', width: '50px', height: '40px' }}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Tenant Details Modal */}
        {selectedTenant && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
                <div className="modal-header border-0 p-4">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: selectedTenant.gradient,
                        fontSize: '16px'
                      }}
                    >
                      {selectedTenant.avatar}
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold mb-1">{selectedTenant.name}</h5>
                      <small className="text-muted">{selectedTenant.propertyName}</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedTenant(null)}
                  ></button>
                </div>
                
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Payment History */}
                    <div className="col-12">
                      <div className="card border-0 bg-light" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-3">Payment History</h6>
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead>
                                <tr>
                                  <th className="border-0 bg-transparent">Month</th>
                                  <th className="border-0 bg-transparent">Amount</th>
                                  <th className="border-0 bg-transparent">Status</th>
                                  <th className="border-0 bg-transparent">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getPaymentStats(selectedTenant).paymentHistory.slice(-5).reverse().map((payment) => (
                                  <tr key={payment.id}>
                                    <td className="border-0">{payment.month}</td>
                                    <td className="border-0">${payment.amount.toLocaleString()}</td>
                                    <td className="border-0">{getPaymentEntryStatusBadge(payment.status)}</td>
                                    <td className="border-0">
                                      {payment.status === 'overdue' || payment.status === 'pending' ? (
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={() => openPaymentModal(selectedTenant, payment)}
                                          style={{ borderRadius: '8px' }}
                                        >
                                          Pay
                                        </button>
                                      ) : (
                                        <span className="text-muted small">Completed</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">Documents</h6>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => openUploadModal(selectedTenant)}
                              style={{ borderRadius: '8px' }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          {selectedTenant.documents.length === 0 ? (
                            <div className="text-center py-4">
                              <FileText size={40} className="text-muted mb-2" />
                              <p className="text-muted">No documents uploaded</p>
                            </div>
                          ) : (
                            <div className="list-group list-group-flush">
                              {selectedTenant.documents.map((doc) => (
                                <div key={doc.id} className="list-group-item border-0 px-0 d-flex align-items-center">
                                  <div className="me-3">
                                    {getDocumentIcon(doc.type)}
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="fw-semibold small">{doc.name}</div>
                                    <div className="text-muted small">{doc.size}</div>
                                  </div>
                                  <div className="d-flex gap-1">
                                    <button className="btn btn-sm btn-outline-primary p-1">
                                      <Eye size={12} />
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger p-1" onClick={() => deleteDocument(selectedTenant.id, doc.id)}>
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Checks */}
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-3">Post-Dated Checks</h6>
                          
                          {!selectedTenant.checks || selectedTenant.checks.length === 0 ? (
                            <div className="text-center py-4">
                              <CreditCard size={40} className="text-muted mb-2" />
                              <p className="text-muted">No checks available</p>
                            </div>
                          ) : (
                            <div className="list-group list-group-flush">
                              {selectedTenant.checks.map((check) => (
                                <div key={check.id} className="list-group-item border-0 px-0">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                      <div className="fw-semibold small">Check #{check.checkNumber}</div>
                                      <div className="text-muted small">${check.amount} • {check.dueDate}</div>
                                    </div>
                                    {getCheckStatusBadge(check.status)}
                                  </div>
                                  {check.status === 'pending' && (
                                    <div className="d-flex gap-1 mt-2">
                                      <button 
                                        className="btn btn-sm btn-success"
                                        onClick={() => openCheckModal(selectedTenant, check, 'realized')}
                                        style={{ borderRadius: '6px' }}
                                      >
                                        Realize
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => openCheckModal(selectedTenant, check, 'bounced')}
                                        style={{ borderRadius: '6px' }}
                                      >
                                        Bounce
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Recording Modal */}
        {showPaymentModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
                <div className="modal-header border-0 p-4">
                  <h5 className="modal-title fw-bold">
                    {paymentForm.isPostDatedCheque ? 'Manage Post-Dated Cheques' : 'Record Payment'} {selectedTenant ? `for ${selectedTenant.name}` : ''}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closePaymentModal}
                  ></button>
                </div>
                
                <div className="modal-body p-4">
                  {selectedTenant && (
                    <div className="mb-4 p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                          style={{ 
                            width: '40px', 
                            height: '40px',
                            background: selectedTenant.gradient,
                            fontSize: '14px'
                          }}
                        >
                          {selectedTenant.avatar}
                        </div>
                        <div>
                          <h6 className="fw-semibold text-primary mb-1">{selectedTenant.propertyName}</h6>
                          <small className="text-muted">{selectedTenant.propertyAddress}</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Type Toggle */}
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <div className="card border-0 bg-light" style={{ borderRadius: '12px' }}>
                        <div className="card-body p-3">
                          <h6 className="fw-bold mb-3">Payment Type</h6>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentType"
                                id="regularPayment"
                                checked={!paymentForm.isPostDatedCheque}
                                onChange={() => setPaymentForm(prev => ({ ...prev, isPostDatedCheque: false }))}
                              />
                              <label className="form-check-label fw-semibold" htmlFor="regularPayment">
                                <DollarSign size={16} className="me-2" />
                                Regular Payment
                              </label>
                              <small className="d-block text-muted">Record an immediate payment</small>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentType"
                                id="postDatedCheque"
                                checked={paymentForm.isPostDatedCheque}
                                onChange={() => setPaymentForm(prev => ({ ...prev, isPostDatedCheque: true, paymentMethod: 'check' }))}
                              />
                              <label className="form-check-label fw-semibold" htmlFor="postDatedCheque">
                                <CreditCard size={16} className="me-2" />
                                Manage Post-Dated Cheques
                              </label>
                              <small className="d-block text-muted">Update existing cheque status</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Tenant Selection - Only show when no specific tenant is selected */}
                    {!selectedTenant && (
                      <div className="col-12">
                        <label className="form-label fw-semibold">Select Tenant *</label>
                        <select
                          className="form-select"
                          name="selectedTenantId"
                          value={paymentForm.selectedTenantId}
                          onChange={(e) => {
                            handlePaymentFormChange(e);
                            const tenant = tenants.find(t => t.id.toString() === e.target.value);
                            if (tenant) {
                              setPaymentForm(prev => ({
                                ...prev,
                                amount: tenant.monthlyRent.toString()
                              }));
                            }
                          }}
                          style={{ borderRadius: '12px' }}
                        >
                          <option value="">Choose a tenant...</option>
                          {tenants.map(tenant => (
                            <option key={tenant.id} value={tenant.id}>
                              {tenant.name} - {tenant.propertyName} (${tenant.monthlyRent}/month)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Display selected tenant info when chosen from dropdown */}
                    {!selectedTenant && paymentForm.selectedTenantId && (
                      <div className="col-12">
                        {(() => {
                          const tenant = tenants.find(t => t.id.toString() === paymentForm.selectedTenantId);
                          return tenant ? (
                            <div className="p-3 bg-light rounded-3">
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                  style={{ 
                                    width: '40px', 
                                    height: '40px',
                                    background: tenant.gradient,
                                    fontSize: '14px'
                                  }}
                                >
                                  {tenant.avatar}
                                </div>
                                <div>
                                  <h6 className="fw-semibold text-primary mb-1">{tenant.name}</h6>
                                  <div className="small text-muted">{tenant.propertyName} • {tenant.propertyAddress}</div>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                    
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Amount *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          name="amount"
                          value={paymentForm.amount}
                          onChange={handlePaymentFormChange}
                          style={{ borderRadius: '0 12px 12px 0' }}
                          readOnly={paymentForm.isPostDatedCheque && paymentForm.selectedChequeId}
                        />
                      </div>
                      {paymentForm.isPostDatedCheque ? (
                        <small className="text-muted">
                          {paymentForm.selectedChequeId ? 'Amount from selected cheque' : 'Select a cheque to see amount'}
                        </small>
                      ) : (
                        <small className="text-muted">Enter payment amount</small>
                      )}
                    </div>

                    {/* Regular Payment Fields */}
                    {!paymentForm.isPostDatedCheque && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Payment Method *</label>
                          <select
                            className="form-select"
                            name="paymentMethod"
                            value={paymentForm.paymentMethod}
                            onChange={handlePaymentFormChange}
                            style={{ borderRadius: '12px' }}
                          >
                            <option value="">Select payment method</option>
                            {paymentMethods.map(method => (
                              <option key={method.value} value={method.value}>{method.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Payment Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            name="paidDate"
                            value={paymentForm.paidDate}
                            onChange={handlePaymentFormChange}
                            style={{ borderRadius: '12px' }}
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">For Month (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="selectedMonth"
                            value={paymentForm.selectedMonth}
                            onChange={handlePaymentFormChange}
                            placeholder="e.g., July 2024"
                            style={{ borderRadius: '12px' }}
                          />
                        </div>
                      </>
                    )}

                    {/* Post-Dated Cheque Management */}
                    {paymentForm.isPostDatedCheque && (
                      <>
                        {/* Info Banner */}
                        <div className="col-12">
                          <div className="alert alert-info border-0" style={{ borderRadius: '12px', background: 'rgba(13, 202, 240, 0.1)' }}>
                            <div className="d-flex align-items-center">
                              <AlertCircle size={20} className="text-info me-2" />
                              <div>
                                <strong>Post-Dated Cheque Management</strong>
                                <div className="small">Select an existing pending cheque below to mark it as realized (successful) or bounced (failed).</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="card border-primary" style={{ borderRadius: '12px' }}>
                            <div className="card-header bg-primary bg-opacity-10 border-0">
                              <h6 className="mb-0 text-primary fw-bold">
                                <CreditCard size={16} className="me-2" />
                                Existing Post-Dated Cheques
                              </h6>
                            </div>
                            <div className="card-body">
                              {(() => {
                                const selectedTenantObj = selectedTenant || tenants.find(t => t.id.toString() === paymentForm.selectedTenantId);
                                const availableCheques = selectedTenantObj?.checks?.filter(check => check.status === 'pending') || [];
                                
                                if (availableCheques.length === 0) {
                                  return (
                                    <div className="text-center py-4">
                                      <CreditCard size={48} className="text-muted mb-3" />
                                      <h6 className="text-muted">No Pending Cheques</h6>
                                      <p className="text-muted mb-0">This tenant has no pending post-dated cheques to manage.</p>
                                      <small className="text-muted">All cheques have already been processed or no cheques were issued.</small>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="row g-3">
                                    {availableCheques.map((cheque) => (
                                      <div key={cheque.id} className="col-md-6">
                                        <div 
                                          className={`card cursor-pointer border-2 transition-all ${
                                            paymentForm.selectedChequeId === cheque.id.toString() 
                                              ? 'border-primary bg-primary bg-opacity-10 shadow-sm' 
                                              : 'border-light hover-shadow'
                                          }`}
                                          style={{ borderRadius: '8px' }}
                                          onClick={() => {
                                            setPaymentForm(prev => ({
                                              ...prev,
                                              selectedChequeId: cheque.id.toString(),
                                              amount: cheque.amount.toString(),
                                              chequeAction: '' // Reset action when selecting new cheque
                                            }));
                                          }}
                                        >
                                          <div className="card-body p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                              <div>
                                                <div className="fw-semibold d-flex align-items-center">
                                                  <CreditCard size={14} className="me-2 text-primary" />
                                                  Check #{cheque.checkNumber}
                                                </div>
                                                <div className="text-muted small">
                                                  ${cheque.amount.toLocaleString()} • Due: {cheque.dueDate}
                                                </div>
                                                {cheque.bankName && (
                                                  <div className="text-muted small">
                                                    🏦 {cheque.bankName}
                                                  </div>
                                                )}
                                              </div>
                                              <div>
                                                {getCheckStatusBadge(cheque.status)}
                                              </div>
                                            </div>
                                            
                                            {cheque.remarks && (
                                              <div className="small text-muted mb-2">
                                                <em>"{cheque.remarks}"</em>
                                              </div>
                                            )}

                                            {paymentForm.selectedChequeId === cheque.id.toString() && (
                                              <div className="mt-3 p-2 bg-white rounded border">
                                                <label className="form-label fw-semibold small mb-2">Select Action:</label>
                                                <div className="d-flex gap-2">
                                                  <button
                                                    type="button"
                                                    className={`btn btn-sm flex-fill ${
                                                      paymentForm.chequeAction === 'realized' 
                                                        ? 'btn-success' 
                                                        : 'btn-outline-success'
                                                    }`}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setPaymentForm(prev => ({ ...prev, chequeAction: 'realized' }));
                                                    }}
                                                  >
                                                    <CheckCircle size={14} className="me-1" />
                                                    Realize
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className={`btn btn-sm flex-fill ${
                                                      paymentForm.chequeAction === 'bounced' 
                                                        ? 'btn-danger' 
                                                        : 'btn-outline-danger'
                                                    }`}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setPaymentForm(prev => ({ ...prev, chequeAction: 'bounced' }));
                                                    }}
                                                  >
                                                    <XCircle size={14} className="me-1" />
                                                    Bounce
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Selected Cheque Details */}
                        {paymentForm.selectedChequeId && paymentForm.chequeAction && (
                          <div className="col-12">
                            <div className="card bg-light border-0" style={{ borderRadius: '12px' }}>
                              <div className="card-body p-3">
                                <h6 className="fw-bold mb-2 d-flex align-items-center">
                                  {paymentForm.chequeAction === 'realized' ? (
                                    <CheckCircle size={18} className="text-success me-2" />
                                  ) : (
                                    <XCircle size={18} className="text-danger me-2" />
                                  )}
                                  Selected Cheque Action
                                </h6>
                                {(() => {
                                  const selectedTenantObj = selectedTenant || tenants.find(t => t.id.toString() === paymentForm.selectedTenantId);
                                  const selectedCheque = selectedTenantObj?.checks?.find(c => c.id.toString() === paymentForm.selectedChequeId);
                                  
                                  if (!selectedCheque) return null;

                                  return (
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div>
                                        <div className="fw-semibold">Check #{selectedCheque.checkNumber}</div>
                                        <div className="small text-muted">${selectedCheque.amount.toLocaleString()} • Due: {selectedCheque.dueDate}</div>
                                        {selectedCheque.bankName && (
                                          <div className="small text-muted">🏦 {selectedCheque.bankName}</div>
                                        )}
                                      </div>
                                      <div className="text-end">
                                        <span className={`badge ${
                                          paymentForm.chequeAction === 'realized' ? 'bg-success' : 'bg-danger'
                                        }`}>
                                          {paymentForm.chequeAction === 'realized' ? '✓ Will be Realized' : '✗ Will be Bounced'}
                                        </span>
                                        <div className="small text-muted mt-1">
                                          {paymentForm.chequeAction === 'realized' 
                                            ? 'Cheque will be marked as successfully cashed' 
                                            : 'Cheque will be marked as returned/failed'
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold">Remarks (Optional)</label>
                      <textarea
                        className="form-control"
                        name="remarks"
                        value={paymentForm.remarks}
                        onChange={handlePaymentFormChange}
                        rows="3"
                        placeholder={
                          paymentForm.isPostDatedCheque 
                            ? (paymentForm.chequeAction === 'bounced' 
                                ? "Add reason for bouncing this cheque..." 
                                : "Add notes about realizing this cheque...")
                            : "Add any remarks about this payment..."
                        }
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                  </div>

                  {uploadStatus && (
                    <div className={`alert ${uploadStatus.type === 'success' ? 'alert-success' : uploadStatus.type === 'error' ? 'alert-danger' : 'alert-info'} border-0 mt-3`}
                         style={{ borderRadius: '12px' }}>
                      <div className="d-flex align-items-center">
                        {uploadStatus.type === 'loading' && (
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        )}
                        {uploadStatus.type === 'success' && <Check size={16} className="me-2" />}
                        {uploadStatus.type === 'error' && <X size={16} className="me-2" />}
                        <span>{uploadStatus.message}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="modal-footer border-0 p-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closePaymentModal}
                    style={{ borderRadius: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success d-flex align-items-center"
                    onClick={handlePaymentRecord}
                    disabled={
                      !paymentForm.selectedTenantId || 
                      uploadStatus?.type === 'loading' ||
                      (paymentForm.isPostDatedCheque && (!paymentForm.selectedChequeId || !paymentForm.chequeAction)) ||
                      (!paymentForm.isPostDatedCheque && (!paymentForm.amount || !paymentForm.paymentMethod || !paymentForm.paidDate))
                    }
                    style={{ borderRadius: '12px' }}
                  >
                    {uploadStatus?.type === 'loading' ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        {paymentForm.isPostDatedCheque ? 'Updating...' : 'Recording...'}
                      </>
                    ) : (
                      <>
                        {paymentForm.isPostDatedCheque ? (
                          <>
                            {paymentForm.chequeAction === 'realized' ? (
                              <CheckCircle size={16} className="me-2" />
                            ) : (
                              <XCircle size={16} className="me-2" />
                            )}
                            {paymentForm.chequeAction === 'realized' ? 'Realize Cheque' : 'Bounce Cheque'}
                          </>
                        ) : (
                          <>
                            <DollarSign size={16} className="me-2" />
                            Record Payment
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Upload Modal */}
        {showUploadModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
                <div className="modal-header border-0 p-4">
                  <h5 className="modal-title fw-bold">
                    Upload Contract Document {selectedTenant ? `for ${selectedTenant.name}` : ''}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeUploadModal}
                  ></button>
                </div>
                
                <div className="modal-body p-4">
                  {/* Tenant Selection - Show when no specific tenant is selected */}
                  {!selectedTenant && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Select Tenant *</label>
                      <select
                        className="form-select"
                        value={selectedTenant ? selectedTenant.id : ''}
                        onChange={(e) => {
                          const tenant = tenants.find(t => t.id.toString() === e.target.value);
                          setSelectedTenant(tenant || null);
                        }}
                        style={{ borderRadius: '12px' }}
                      >
                        <option value="">Choose a tenant...</option>
                        {tenants.map(tenant => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.name} - {tenant.propertyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedTenant && (
                    <div className="mb-4 p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                          style={{ 
                            width: '50px', 
                            height: '50px',
                            background: selectedTenant.gradient,
                            fontSize: '16px'
                          }}
                        >
                          {selectedTenant.avatar}
                        </div>
                        <div>
                          <h6 className="fw-semibold text-primary mb-1">{selectedTenant.propertyName}</h6>
                          <div className="small text-muted">{selectedTenant.name} • {selectedTenant.propertyAddress}</div>
                          <div className="small">
                            <span className={`badge bg-${
                              (() => {
                                const today = new Date();
                                const leaseEnd = new Date(selectedTenant.leaseEnd);
                                const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                                return daysUntilExpiry <= 30 ? 'danger' : daysUntilExpiry <= 90 ? 'warning' : 'success';
                              })()
                            } bg-opacity-10 text-${
                              (() => {
                                const today = new Date();
                                const leaseEnd = new Date(selectedTenant.leaseEnd);
                                const daysUntilExpiry = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
                                return daysUntilExpiry <= 30 ? 'danger' : daysUntilExpiry <= 90 ? 'warning' : 'success';
                              })()
                            }`}>
                              Contract expires: {selectedTenant.leaseEnd}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Document Type *</label>
                      <select
                        className="form-select"
                        name="documentType"
                        value={uploadForm.documentType}
                        onChange={handleUploadFormChange}
                        style={{ borderRadius: '12px' }}
                      >
                        <option value="">Select document type</option>
                        {documentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold">Select File *</label>
                      <div 
                        className="border-2 border-dashed rounded-3 p-4 text-center"
                        style={{ 
                          borderColor: uploadForm.file ? '#28a745' : '#dee2e6',
                          backgroundColor: uploadForm.file ? '#f8f9fa' : 'transparent'
                        }}
                      >
                        <input
                          type="file"
                          className="form-control d-none"
                          id="fileInput"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="fileInput" className="cursor-pointer">
                          {uploadForm.file ? (
                            <div>
                              <CheckCircle size={48} className="text-success mb-3" />
                              <h6 className="fw-semibold text-success">{uploadForm.file.name}</h6>
                              <p className="text-muted mb-0">{(uploadForm.file.size / 1024).toFixed(1)} KB</p>
                              <small className="text-success">Click to change file</small>
                            </div>
                          ) : (
                            <div>
                              <Upload size={48} className="text-muted mb-3" />
                              <h6 className="fw-semibold">Choose a file or drag & drop</h6>
                              <p className="text-muted mb-0">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                              <small className="text-muted">Maximum file size: 10MB</small>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description (Optional)</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={uploadForm.description}
                        onChange={handleUploadFormChange}
                        rows="3"
                        placeholder="Add a description or notes about this document"
                        style={{ borderRadius: '12px' }}
                      />
                    </div>

                    {/* Document Categories for better organization */}
                    <div className="col-12">
                      <div className="card border-0 bg-light" style={{ borderRadius: '12px' }}>
                        <div className="card-body p-3">
                          <h6 className="fw-bold mb-3">Quick Document Categories</h6>
                          <div className="row g-2">
                            {[
                              { type: 'lease', icon: FileText, label: 'Lease Agreement', color: 'primary' },
                              { type: 'receipt', icon: DollarSign, label: 'Payment Receipt', color: 'success' },
                              { type: 'insurance', icon: AlertCircle, label: 'Insurance', color: 'warning' },
                              { type: 'identity', icon: User, label: 'ID Proof', color: 'info' }
                            ].map((category) => (
                              <div key={category.type} className="col-6 col-md-3">
                                <button
                                  type="button"
                                  className={`btn w-100 d-flex flex-column align-items-center p-3 ${
                                    uploadForm.documentType === category.type 
                                      ? `btn-${category.color}` 
                                      : `btn-outline-${category.color}`
                                  }`}
                                  style={{ borderRadius: '8px' }}
                                  onClick={() => setUploadForm(prev => ({ ...prev, documentType: category.type }))}
                                >
                                  <category.icon size={24} className="mb-1" />
                                  <small>{category.label}</small>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {uploadStatus && (
                    <div className={`alert ${uploadStatus.type === 'success' ? 'alert-success' : uploadStatus.type === 'error' ? 'alert-danger' : 'alert-info'} border-0 mt-3`}
                         style={{ borderRadius: '12px' }}>
                      <div className="d-flex align-items-center">
                        {uploadStatus.type === 'loading' && (
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        )}
                        {uploadStatus.type === 'success' && <Check size={16} className="me-2" />}
                        {uploadStatus.type === 'error' && <X size={16} className="me-2" />}
                        <span>{uploadStatus.message}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="modal-footer border-0 p-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeUploadModal}
                    style={{ borderRadius: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleDocumentUpload}
                    disabled={!uploadForm.file || !uploadForm.documentType || !selectedTenant || uploadStatus?.type === 'loading'}
                    style={{ borderRadius: '12px' }}
                  >
                    {uploadStatus?.type === 'loading' ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="me-2" />
                        Upload Document
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check Status Update Modal */}
        {showCheckModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
                <div className="modal-header border-0 p-4">
                  <h5 className="modal-title fw-bold">
                    {checkAction === 'realized' ? 'Mark Check as Realized' : 'Mark Check as Bounced'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeCheckModal}
                  ></button>
                </div>
                
                <div className="modal-body p-4">
                  <div className="mb-4 p-3 bg-light rounded-3">
                    <h6 className="fw-semibold text-primary">{selectedTenant?.name}</h6>
                    <div className="small text-muted">
                      <strong>Check #{selectedCheck?.checkNumber}</strong> • 
                      Amount: ${selectedCheck?.amount} • 
                      Due: {selectedCheck?.dueDate}
                    </div>
                  </div>

                  <div className="row g-3">
                    {checkAction === 'bounced' && (
                      <div className="col-12">
                        <label className="form-label fw-semibold">Bounce Reason *</label>
                        <select
                          className="form-select"
                          name="bounceReason"
                          value={checkUpdateForm.bounceReason}
                          onChange={handleCheckFormChange}
                          style={{ borderRadius: '12px' }}
                        >
                          <option value="">Select bounce reason</option>
                          {bounceReasons.map(reason => (
                            <option key={reason.value} value={reason.value}>{reason.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold">Remarks (Optional)</label>
                      <textarea
                        className="form-control"
                        name="remarks"
                        value={checkUpdateForm.remarks}
                        onChange={handleCheckFormChange}
                        rows="3"
                        placeholder={`Add remarks about this ${checkAction} check...`}
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                  </div>

                  {uploadStatus && (
                    <div className={`alert ${uploadStatus.type === 'success' ? 'alert-success' : uploadStatus.type === 'error' ? 'alert-danger' : 'alert-info'} border-0 mt-3`}
                         style={{ borderRadius: '12px' }}>
                      <div className="d-flex align-items-center">
                        {uploadStatus.type === 'loading' && (
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        )}
                        {uploadStatus.type === 'success' && <Check size={16} className="me-2" />}
                        {uploadStatus.type === 'error' && <X size={16} className="me-2" />}
                        <span>{uploadStatus.message}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="modal-footer border-0 p-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeCheckModal}
                    style={{ borderRadius: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${checkAction === 'realized' ? 'btn-success' : 'btn-danger'} d-flex align-items-center`}
                    onClick={handleCheckUpdate}
                    disabled={uploadStatus?.type === 'loading'}
                    style={{ borderRadius: '12px' }}
                  >
                    {uploadStatus?.type === 'loading' ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        {checkAction === 'realized' ? (
                          <CheckCircle size={16} className="me-2" />
                        ) : (
                          <XCircle size={16} className="me-2" />
                        )}
                        {checkAction === 'realized' ? 'Mark as Realized' : 'Mark as Bounced'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDetails;