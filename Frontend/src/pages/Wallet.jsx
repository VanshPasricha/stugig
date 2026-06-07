import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Clock, Download, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import api from '../utils/axiosInterceptor';

export default function Wallet() {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [inEscrow, setInEscrow] = useState(0);
    const [loading, setLoading] = useState(true);
    const [withdrawing, setWithdrawing] = useState(false);
    const [error, setError] = useState('');
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [toppingUp, setToppingUp] = useState(false);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const fetchWalletData = async () => {
        try {
            const { data } = await api.get('/api/wallet/transactions');
            setTransactions(data.transactions);
            setBalance(data.balance);
            setInEscrow(data.inEscrow);
        } catch (err) {
            console.error('Failed to fetch wallet data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleWithdraw = async () => {
        if (balance <= 0) return;
        setWithdrawing(true);
        setError('');
        try {
            // Mocking a full withdrawal for demonstration
            await api.post('/api/wallet/withdraw', { amount: balance });
            fetchWalletData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process withdrawal');
        } finally {
            setWithdrawing(false);
        }
    };

    const handleTopUp = async () => {
        const amount = parseFloat(topUpAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setToppingUp(true);
        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 1. Create order
            const { data: order } = await api.post('/api/payments/create-order', { amount });
            
            // 2. Fetch key
            const { data: { key } } = await api.get('/api/payments/key');

            // 3. Configure Razorpay
            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: 'StuGig Wallet',
                description: 'Top up your wallet',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await api.post('/api/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: amount
                        });
                        alert('Payment successful! Funds added to your wallet.');
                        setShowTopUpModal(false);
                        setTopUpAmount('');
                        fetchWalletData(); // Refresh balance
                    } catch (err) {
                        alert(err.response?.data?.message || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: 'StuGig User',
                    email: 'user@stugig.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#6366f1' // primary color
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setToppingUp(false);
        }
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) return;

        const headers = ['Transaction ID', 'Date', 'Type', 'Status', 'Amount', 'Description'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(txn => [
                txn._id,
                new Date(txn.createdAt).toLocaleString(),
                txn.type,
                txn.status,
                txn.amount,
                `"${txn.description}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stugig_transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Earnings & Finances</h1>
                        <p className="text-muted-foreground mt-1">Manage your funds, track payments, and withdraw earnings.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowTopUpModal(true)}
                            className="px-5 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg shadow-sm hover:bg-accent/90 transition-colors flex items-center gap-2"
                        >
                            Add Funds
                        </button>
                        <button 
                            onClick={handleWithdraw}
                            disabled={withdrawing || balance <= 0}
                            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Withdraw Funds'}
                        </button>
                    </div>
                </header>

                {/* Top Up Modal */}
                {showTopUpModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card border border-border p-6 rounded-2xl shadow-xl w-full max-w-sm"
                        >
                            <h3 className="text-xl font-bold mb-4">Top Up Wallet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Enter the amount you want to add to your wallet.</p>
                            <div className="relative mb-6">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input 
                                    type="number"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowTopUpModal(false)}
                                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted/50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleTopUp}
                                    disabled={toppingUp || !topUpAmount}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {toppingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Proceed to Pay'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Balance Card */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Available Balance</p>
                                <h2 className="text-5xl font-extrabold tracking-tight text-foreground">${balance.toFixed(2)}</h2>
                            </div>
                            
                            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-primary/10">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">In Escrow (Pending)</p>
                                    <p className="font-bold text-lg text-foreground flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-500" /> ${inEscrow.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Total Lifetime Earnings</p>
                                    <p className="font-bold text-lg text-foreground flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-500" /> ${(balance + inEscrow).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions / Bank Info */}
                    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
                        <h3 className="font-bold mb-4">Payment Methods</h3>
                        
                        <div className="flex-1 space-y-4">
                            <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border shadow-sm text-lg font-bold">🏦</div>
                                    <div>
                                        <p className="font-medium text-sm text-foreground">Chase Checking</p>
                                        <p className="text-xs text-muted-foreground">**** 4921</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Primary</span>
                            </div>
                            
                            <button className="w-full py-3 border border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                                + Add Bank Account
                            </button>
                        </div>
                        
                        <div className="mt-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Identity verified. Your account is ready for withdrawals.</p>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/10">
                        <h2 className="text-xl font-bold">Recent Transactions</h2>
                        <button onClick={handleExportCSV} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                    
                    <div className="divide-y divide-border/50">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                        ) : transactions.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">No transactions yet.</div>
                        ) : transactions.map((txn, i) => (
                            <motion.div 
                                key={txn._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'incoming' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {txn.type === 'incoming' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{txn.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">{new Date(txn.createdAt).toLocaleDateString()}</span>
                                            <span className="text-muted-foreground text-[10px]">•</span>
                                            <span className="text-xs text-muted-foreground">{txn._id.slice(-6)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                                    <span className={`font-bold ${txn.type === 'incoming' ? 'text-green-500' : 'text-foreground'}`}>
                                        {txn.type === 'incoming' ? '+' : '-'}${txn.amount.toFixed(2)}
                                    </span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 ${
                                        txn.status === 'completed' ? 'bg-muted text-muted-foreground' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {txn.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="p-4 border-t border-border/50 text-center">
                        <button className="text-sm font-medium text-primary hover:underline">View All Transactions</button>
                    </div>
                </div>

            </div>
        </main>
    );
}
