const SIPCalculator = (req, res) => {

    const { sip_monthly_amount, sip_duration_in_months, sip_return } = req.body;

    if(!sip_monthly_amount || !sip_duration_in_months || !sip_return) {
        return res.status(400).json({ message: 'Invalid input. Please provide all required fields.' });
    }

    const monthlyRate = sip_return / 12 /100;

    const maturityAmount  = sip_monthly_amount * ((Math.pow(1 + monthlyRate, sip_duration_in_months)- 1) / monthlyRate) * (1 + monthlyRate);

    res.status(200).json({
        sip_monthly_amount,
        sip_duration_in_months,
        sip_return,
        maturity_amount: maturityAmount .toFixed(2)
    });

}

const delaySIP =(req, res) => {
    const { sip_monthly_amount, sip_duration_in_months, sip_return, delay_in_starting_sip_in_months } = req.body;

    if (!sip_monthly_amount || !sip_duration_in_months || !sip_return || delay_in_starting_sip_in_months == null) {
        return res.status(400).json({ error: 'Please provide all the required fields.' });
    }

    const calculateSIPValue = (monthlyAmount, duration, rate) => {
        let totalValue = 0;
        for (let i = 0; i < duration; i++) {
            totalValue += monthlyAmount * Math.pow(1 + rate / 100 / 12, duration - i);
        }
        return totalValue;
    };

    // Calculate potential earnings if started today
    const valueIfStartedToday = calculateSIPValue(sip_monthly_amount, sip_duration_in_months, sip_return);

    // Calculate potential earnings if started after the delay
    const valueIfStartedAfterDelay = calculateSIPValue(sip_monthly_amount, sip_duration_in_months - delay_in_starting_sip_in_months, sip_return);

    // Cost of delay
    const costOfDelay = valueIfStartedToday - valueIfStartedAfterDelay;

    res.json({
        value_if_started_today: valueIfStartedToday.toFixed(2),
        value_if_started_after_delay: valueIfStartedAfterDelay.toFixed(2),
        cost_of_delay: costOfDelay.toFixed(2)
    });
};




module.exports = {SIPCalculator, delaySIP};