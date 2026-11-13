export const FAQ_DATA = [
  {
    id: "faq-1",
    category: "pending",
    question: "My payment shows as Pending. What should I do?",
    answer: [
      "Open your UPI app (Google Pay, PhonePe, Paytm, etc.) and check the transaction status there.",
      "Do NOT make another payment until the status of the first transaction is clear — either confirmed or failed.",
      "If the status remains pending for more than a few minutes, ask the stall owner if they received the payment on their end.",
      "Keep a note of the transaction reference number shown in your UPI app.",
      "If the issue persists, contact your UPI provider's official support channel."
    ],
    tags: ["pending", "transaction", "status"]
  },
  {
    id: "faq-2",
    category: "deducted",
    question: "Money was deducted from my account but the stall owner says they didn't receive it.",
    answer: [
      "First, check the transaction details in your UPI app — look for the transaction status (Success, Pending, or Failed).",
      "If the status shows 'Success', take a screenshot of the transaction confirmation for your records.",
      "Keep your transaction reference number private — share only what is necessary when seeking official support.",
      "Contact your UPI provider's official support or raise a dispute through the official app. Do not share your UPI PIN or banking password with anyone.",
      "Do not immediately pay again — wait for the first transaction to be resolved.",
      "CampusPay does not process payments and cannot verify transaction status. For resolution, use your UPI provider's official support channel."
    ],
    tags: ["deducted", "not received", "refund", "money deducted"]
  },
  {
    id: "faq-3",
    category: "qr",
    question: "The QR code isn't scanning or the app shows an error.",
    answer: [
      "Ensure the QR code is clearly visible and not damaged or obscured.",
      "Try using a different UPI app on your phone.",
      "Check if the stall has an alternative authorized QR code — ask the stall owner.",
      "If no QR code is available, ask the stall owner whether cash or direct UPI ID transfer is accepted.",
      "Use cash only if the stall explicitly accepts it.",
      "Report broken or suspicious QR codes to the stall owner or campus administration."
    ],
    tags: ["qr code", "not scanning", "error", "scan"]
  },
  {
    id: "faq-4",
    category: "internet",
    question: "My internet connection is slow or the payment app is freezing.",
    answer: [
      "Wait for a stable connection before confirming the transaction status.",
      "Do not tap the 'Pay' button multiple times — this may result in duplicate charges.",
      "If the app freezes during payment, wait for it to respond and then check the transaction status.",
      "Move to an area with better network coverage before retrying.",
      "Ask the stall owner if they received payment before attempting any retry.",
      "If possible, ask the stall owner whether cash is accepted as an alternative."
    ],
    tags: ["internet", "slow", "network", "freezing", "connection"]
  },
  {
    id: "faq-5",
    category: "failed",
    question: "My payment has failed. What now?",
    answer: [
      "Open your UPI app and verify the transaction status — a 'Failed' status means no money was deducted.",
      "If the money was deducted despite a failure message, check your bank account balance and the transaction history in your UPI app.",
      "If funds were deducted for a failed transaction, contact your UPI provider's official support for a refund.",
      "Ask the stall owner about alternative payment methods (cash, different UPI app, etc.).",
      "CampusPay does not process payments and cannot initiate refunds. All refund requests must go through your UPI provider or bank."
    ],
    tags: ["failed", "payment failed", "retry", "refund"]
  },
  {
    id: "faq-6",
    category: "general",
    question: "How do I find the correct QR code for a stall?",
    answer: [
      "Use CampusPay to open the stall's detail page — authorized QR images are displayed there if available.",
      "Always verify the recipient name shown in your UPI app before completing payment.",
      "If the QR code shown in the app does not match the stall name, do not proceed.",
      "Only use QR codes that are officially displayed by the stall or listed on CampusPay.",
      "Never scan QR codes received from unknown sources or shared via messaging apps."
    ],
    tags: ["qr code", "correct", "official", "authorized"]
  },
  {
    id: "faq-7",
    category: "general",
    question: "What payment methods does CampusPay support?",
    answer: [
      "CampusPay is a payment information and guidance platform — it does NOT process any payments.",
      "CampusPay helps you discover which payment methods each stall accepts (UPI, cash, etc.).",
      "Actual payments are made directly through your UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.) or by giving cash to the stall owner.",
      "Do not enter your UPI PIN or banking details anywhere on CampusPay."
    ],
    tags: ["payment methods", "upi", "cash", "supported"]
  }
];
