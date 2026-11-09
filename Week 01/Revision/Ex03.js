const payments = [
    { petName: "Chester", amount: 50, status: "APPROVED" },
    { petName: "Mochi", amount: 80, status: "PENDING" },
    { petName: "Mira", amount: 40, status: "DECLINED" }
];

//a
console.log("Mochi's payment status: " + payments[1].status);

//b
for (let i = 0; i < payments.length; i++) {
    if (payments[i].status === "APPROVED") {
        console.log(payments[i].petName + "'s payment is approved.");
    } else if (payments[i].status === "PENDING") {
        console.log(payments[i].petName + "'s payment is pending.");
    } else if (payments[i].status === "DECLINED") {
        console.log(payments[i].petName + "'s payment is declined.");
    }
}