import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react';

interface FinancingCalculatorProps {
  vehiclePrice?: number;
}

const FinancingCalculator = ({ vehiclePrice = 2000000 }: FinancingCalculatorProps) => {
  const [loanAmount, setLoanAmount] = useState(vehiclePrice * 0.8); // 80% financing
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2); // 20% down
  const [interestRate, setInterestRate] = useState(15); // 15% typical in Kenya
  const [loanTerm, setLoanTerm] = useState(60); // 5 years
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount).replace('KES', 'KSH');
  };

  const calculateLoan = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    if (monthlyRate === 0) {
      const payment = principal / numPayments;
      setMonthlyPayment(payment);
      setTotalInterest(0);
      setTotalAmount(principal);
    } else {
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                      (Math.pow(1 + monthlyRate, numPayments) - 1);
      const total = payment * numPayments;
      const interest = total - principal;

      setMonthlyPayment(payment);
      setTotalInterest(interest);
      setTotalAmount(total);
    }
  };

  const handleVehiclePriceChange = (price: number) => {
    setDownPayment(price * 0.2);
    setLoanAmount(price * 0.8);
  };

  const handleDownPaymentChange = (down: number) => {
    setDownPayment(down);
    setLoanAmount(vehiclePrice - down);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="flex items-center text-xl text-blue-900">
          <Calculator className="h-6 w-6 mr-2" />
          Auto Loan Calculator
        </CardTitle>
        <p className="text-sm text-gray-600">
          Estimate your monthly car payment with our financing calculator
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehiclePrice" className="flex items-center text-sm font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                Vehicle Price (KSH)
              </Label>
              <Input
                id="vehiclePrice"
                type="number"
                value={vehiclePrice}
                onChange={(e) => handleVehiclePriceChange(Number(e.target.value))}
                className="text-lg font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment" className="flex items-center text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                Down Payment (KSH)
              </Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                className="text-lg font-medium"
              />
              <p className="text-xs text-gray-500">
                {((downPayment / vehiclePrice) * 100).toFixed(0)}% of vehicle price
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanAmount" className="flex items-center text-sm font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                Loan Amount (KSH)
              </Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="text-lg font-medium bg-gray-50"
                readOnly
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestRate" className="flex items-center text-sm font-medium">
                  <Percent className="h-4 w-4 mr-1" />
                  Interest Rate (%)
                </Label>
                <Select value={interestRate.toString()} onValueChange={(value) => setInterestRate(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12% - Excellent Credit</SelectItem>
                    <SelectItem value="15">15% - Good Credit</SelectItem>
                    <SelectItem value="18">18% - Fair Credit</SelectItem>
                    <SelectItem value="22">22% - Poor Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm" className="flex items-center text-sm font-medium">
                  <Calendar className="h-4 w-4 mr-1" />
                  Loan Term
                </Label>
                <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="36">3 Years (36 months)</SelectItem>
                    <SelectItem value="48">4 Years (48 months)</SelectItem>
                    <SelectItem value="60">5 Years (60 months)</SelectItem>
                    <SelectItem value="72">6 Years (72 months)</SelectItem>
                    <SelectItem value="84">7 Years (84 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={calculateLoan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Payment
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Monthly Payment</h3>
              <div className="text-3xl font-bold text-green-900">
                {formatCurrency(monthlyPayment)}
              </div>
              <p className="text-sm text-green-600 mt-1">per month for {loanTerm} months</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(totalInterest)}</span>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                  <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Financing Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Financing Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Higher down payment = Lower monthly payment</li>
                <li>• Shop around for the best interest rates</li>
                <li>• Consider your budget for insurance & maintenance</li>
                <li>• Pre-approval can strengthen your negotiation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Finance Your Dream Car?
            </h3>
            <p className="text-gray-600 mb-4">
              Our finance experts can help you get pre-approved and find the best rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Get Pre-Approved
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Speak to Finance Expert
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancingCalculator;