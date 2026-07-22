import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { verifyAdminToken, requireSuperAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

 

                   

                                              

 
router.get('/loans', verifyAdminToken, async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    loan_type,
    member_id,
    group_id,
    startDate,
    endDate,
    search
  } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const offset = (pageNum - 1) * limitNum;

  

  const filters = [];

  if (status) {
    filters.push(`status = "${status}"`);
  }

  if (loan_type) {
    filters.push(`loan_type = "${loan_type}"`);
  }

  if (member_id) {
    filters.push(`member_id = "${member_id}"`);
  }

  if (group_id) {
    filters.push(`group_id = "${group_id}"`);
  }

  if (startDate) {
    filters.push(`created_date >= "${startDate}"`);
  }

  if (endDate) {
    filters.push(`created_date <= "${endDate}"`);
  }

  if (search) {
    filters.push(`(amount ~ "${search}" || member_id ~ "${search}")`);
  }

  const filterString = filters.length > 0 ? filters.join(' && ') : '';

  try {
    

    const loans = await pb.collection('loans').getFullList({
      filter: filterString,
      sort: '-created_date',
      skip: offset,
      take: limitNum,
      expand: 'member_id,group_id'
    });

    

    const allLoans = await pb.collection('loans').getFullList({
      filter: filterString,
    });

    res.json({
      loans: loans.map((loan) => ({
        id: loan.id,
        member_id: loan.member_id,
        member_name: loan.expand?.member_id?.first_name + ' ' + loan.expand?.member_id?.last_name,
        group_id: loan.group_id,
        group_name: loan.expand?.group_id?.name,
        loan_type: loan.loan_type,
        amount: loan.amount,
        balance: loan.balance || loan.amount,
        interest_rate: loan.interest_rate,
        status: loan.status,
        created_date: loan.created,
        disbursement_date: loan.disbursement_date,
        last_payment_date: loan.last_payment_date,
        repayment_date: loan.repayment_date,
      })),
      total: allLoans.length,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    logger.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

 

                                  

                                                 

 
router.put('/loans/:loanId/status', verifyAdminToken, async (req, res) => {
  const { loanId } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['approved', 'active', 'rejected', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  try {
    

    const loan = await pb.collection('loans').getOne(loanId);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    

    const currentStatus = loan.status;
    const validTransitions = {
      'pending': ['approved', 'rejected', 'cancelled'],
      'approved': ['active', 'rejected', 'cancelled'],
      'active': ['repaid', 'defaulted'],
      'rejected': [],
      'cancelled': [],
      'repaid': [],
      'defaulted': []
    };

    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        error: `Cannot change status from ${currentStatus} to ${status}`
      });
    }

    

    const updateData = { status };

    if (status === 'active') {
      updateData.disbursement_date = new Date().toISOString();
    }

    const updatedLoan = await pb.collection('loans').update(loanId, updateData);

    

    await pb.collection('admin_activity_log').create({
      admin_id: req.adminId,
      action: 'loan_status_updated',
      details: `Updated loan ${loanId} status from ${currentStatus} to ${status}`,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    });

    

    if (status === 'active') {
      await pb.collection('contributions_history').create({
        member_id: loan.member_id,
        group_id: loan.group_id,
        type: 'loan_disbursement',
        amount: loan.amount,
        date: new Date().toISOString(),
        description: 'Loan Disbursement',
        balance: loan.amount,
      });
    }

    logger.info(`Loan ${loanId} status updated to ${status} by admin ${req.adminId}`);

    res.json({
      loan: {
        id: updatedLoan.id,
        status: updatedLoan.status,
        disbursement_date: updatedLoan.disbursement_date,
      }
    });

  } catch (error) {
    logger.error('Error updating loan status:', error);
    res.status(500).json({ error: 'Failed to update loan status' });
  }
});

 

                                     

                                         

 
router.get('/loans/:loanId/approvals', verifyAdminToken, async (req, res) => {
  const { loanId } = req.params;

  try {
    const approvals = await pb.collection('loan_approvals').getFullList({
      filter: `loan_id = "${loanId}"`,
      expand: 'member_id',
      sort: 'created_date'
    });

    res.json({
      approvals: approvals.map((approval) => ({
        id: approval.id,
        member_id: approval.member_id,
        member_name: approval.expand?.member_id?.first_name + ' ' + approval.expand?.member_id?.last_name,
        approved: approval.approved,
        vote_type: approval.vote_type,
        created_date: approval.created,
        updated_date: approval.updated,
      }))
    });

  } catch (error) {
    logger.error('Error fetching loan approvals:', error);
    res.status(500).json({ error: 'Failed to fetch loan approvals' });
  }
});

 

                             

                           

 
router.get('/dashboard/stats', verifyAdminToken, async (req, res) => {
  try {
    

    const allLoans = await pb.collection('loans').getFullList();
    const activeLoans = allLoans.filter(l => l.status === 'active');
    const totalLoanAmount = allLoans.reduce((sum, l) => sum + (l.amount || 0), 0);
    const totalOutstanding = activeLoans.reduce((sum, l) => sum + (l.balance || l.amount || 0), 0);

    

    const allSavings = await pb.collection('savings').getFullList();
    const totalSavings = allSavings.reduce((sum, s) => sum + (s.total_savings || 0), 0);

    

    const allMembers = await pb.collection('members').getFullList();
    const activeMembers = allMembers.filter(m => m.status === 'active');

    

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const recentLoans = allLoans.filter(l => l.created >= thirtyDaysAgo);
    const [allContributions, allRepayments] = await Promise.all([
      pb.collection('savings_contributions').getFullList(),
      pb.collection('loan_repayments').getFullList(),
    ]);
    const recentContributions = allContributions.filter((record) => record.created >= thirtyDaysAgo);
    const recentRepayments = allRepayments.filter((record) => record.created >= thirtyDaysAgo);

    res.json({
      loans: {
        total: allLoans.length,
        active: activeLoans.length,
        total_amount: totalLoanAmount,
        outstanding_balance: totalOutstanding,
        recent: recentLoans.length,
      },
      savings: {
        total_members: allSavings.length,
        total_amount: totalSavings,
        recent_contributions: recentContributions.length,
      },
      members: {
        total: allMembers.length,
        active: activeMembers.length,
      },
      activities: {
        recent_loans: recentLoans.length,
        recent_contributions: recentContributions.length,
        recent_repayments: recentRepayments.length,
      }
    });

  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

router.get('/analytics', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  try {
    const [members, savings, loans, groups] = await Promise.all([
      pb.collection('members').getFullList({ $autoCancel: false }),
      pb.collection('savings').getFullList({ $autoCancel: false }),
      pb.collection('loans').getFullList({ $autoCancel: false }),
      pb.collection('groups').getFullList({ $autoCancel: false }),
    ]);

    const totalSavings = savings.reduce((sum, record) => sum + Number(record.amount || record.total_savings || 0), 0);
    const eligibleLoans = loans.filter((loan) => !['rejected', 'pending'].includes(loan.status));
    const totalLoans = eligibleLoans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);
    const activeLoans = loans.filter((loan) => ['active', 'partially_paid'].includes(loan.status)).length;
    const defaultedLoans = loans.filter((loan) => ['defaulted', 'overdue'].includes(loan.status)).length;
    const defaultRate = loans.length > 0 ? `${((defaultedLoans / loans.length) * 100).toFixed(1)}%` : '0%';

    const groupData = groups.map((group) => ({
      name: group.group_name || group.name || 'Unnamed group',
      savings: savings
        .filter((record) => record.group_id === group.id)
        .reduce((sum, record) => sum + Number(record.amount || record.total_savings || 0), 0),
      loans: loans
        .filter((loan) => loan.group_id === group.id && loan.status !== 'rejected')
        .reduce((sum, loan) => sum + Number(loan.amount || 0), 0),
    }));

    res.json({
      stats: {
        totalMembers: members.length,
        totalSavings,
        totalLoans,
        activeLoans,
        defaultRate,
      },
      groupData,
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

 

                                  

                                                                

 
router.post('/automations/trigger', verifyAdminToken, async (req, res) => {
  const { automation_type } = req.body;

  if (!automation_type) {
    return res.status(400).json({ error: 'automation_type is required' });
  }

  try {
    let result = {};

    switch (automation_type) {
      case 'overdue_check':
        

        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const activeLoans = await pb.collection('loans').getFullList({
          filter: "status = 'active'"
        });

        let penaltiesApplied = 0;

        for (const loan of activeLoans) {
          const lastPaymentDate = loan.last_payment_date;
          const memberId = loan.member_id;
          const loanBalance = loan.balance || 0;

          let isOverdue = false;

          if (!lastPaymentDate) {
            const disbursementDate = loan.disbursement_date;
            if (disbursementDate && new Date(disbursementDate) < thirtyDaysAgo) {
              isOverdue = true;
            }
          } else {
            if (new Date(lastPaymentDate) < thirtyDaysAgo) {
              isOverdue = true;
            }
          }

          if (isOverdue) {
            const penaltyAmount = Math.max(loanBalance * 0.01, 100);

            

            const todayStr = today.toISOString().split('T')[0];
            const existingPenalties = await pb.collection('penalties').getFullList({
              filter: `member_id = "${memberId}" && loan_id = "${loan.id}" && created_date >= "${todayStr}"`
            });

            if (existingPenalties.length === 0) {
              await pb.collection('penalties').create({
                member_id: memberId,
                loan_id: loan.id,
                amount: penaltyAmount,
                reason: 'Overdue loan repayment - manual trigger',
                type: 'automatic',
              });

              

              await pb.collection('loans').update(loan.id, {
                balance: loanBalance + penaltyAmount
              });

              penaltiesApplied++;
            }
          }
        }

        result = { penalties_applied: penaltiesApplied };
        break;

      case 'interest_distribution':
        

        const allSavings = await pb.collection('savings').getFullList();
        let totalSavings = 0;
        let totalInterest = 0;

        allSavings.forEach((savings) => {
          totalSavings += savings.total_savings || 0;
        });

        const monthlyInterestRate = 0.08 / 12;
        totalInterest = totalSavings * monthlyInterestRate;

        if (totalInterest > 0 && totalSavings > 0) {
          for (const savings of allSavings) {
            const memberSavings = savings.total_savings || 0;
            const memberInterest = (memberSavings / totalSavings) * totalInterest;

            if (memberInterest > 0) {
              await pb.collection('savings').update(savings.id, {
                total_savings: memberSavings + memberInterest
              });

              await pb.collection('contributions_history').create({
                member_id: savings.member_id,
                group_id: savings.group_id,
                type: 'interest_earned',
                amount: memberInterest,
                date: new Date().toISOString(),
                description: 'Manual Interest Distribution',
                balance: memberSavings + memberInterest,
              });
            }
          }
        }

        result = {
          total_savings: totalSavings,
          total_interest_distributed: totalInterest,
          members_affected: allSavings.length
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid automation_type' });
    }

    

    await pb.collection('admin_activity_log').create({
      admin_id: req.adminId,
      action: 'automation_triggered',
      details: `Manually triggered ${automation_type} automation`,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    });

    logger.info(`Automation ${automation_type} triggered manually by admin ${req.adminId}`);

    res.json({
      success: true,
      automation_type,
      result
    });

  } catch (error) {
    logger.error('Error triggering automation:', error);
    res.status(500).json({ error: 'Failed to trigger automation' });
  }
});

export default router;
