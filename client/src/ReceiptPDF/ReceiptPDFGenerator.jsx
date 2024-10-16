import jsPDF from "jspdf";
import React from "react";
import "jspdf-autotable"; // Import the autotable library

const ReceiptPDFGenerator = ({ transactionDetails, logoUrl }) => {
  const generatePDF = () => {
    if (!transactionDetails) return; // Avoid errors if transaction details aren't available yet

    const doc = new jsPDF();

    // Add your logo using the logoUrl passed from PaymentReceipt
    doc.addImage(logoUrl, "PNG", 80, 10, 40, 40); // Adjust position and size as needed

    // Title in Bootstrap danger color, centered
    doc.setTextColor(220, 53, 69);
    doc.setFontSize(18);
    doc.text("Transaction Receipt", doc.internal.pageSize.width / 2, 60, {
      align: "center",
    }); // Centered title

    // Transaction details - labels and values
    doc.setTextColor(0, 0, 0); // Black text for transaction details
    doc.setFontSize(12);

    // Adding more spaces between the label and the value for alignment
    doc.text(`Username:`, 20, 80);
    doc.text(`${transactionDetails.user}`, 100, 80); // Spacing between label and value

    doc.text(`Amount Paid:`, 20, 90);
    doc.text(`₦${transactionDetails.amountPaid}`, 100, 90); // Spacing between label and value

    doc.text(`Transaction Date:`, 20, 100);
    doc.text(`${new Date(transactionDetails.date).toLocaleString()}`, 100, 100); // Spacing between label and value

    doc.text(`Status:`, 20, 110);
    doc.text(
      `${
        transactionDetails.payment_status === "success"
          ? "Payment Successful"
          : "Payment Failed"
      }`,
      100,
      110
    ); // Spacing between label and value

    doc.text(`Reference:`, 20, 120);
    doc.text(`${transactionDetails.payment_reference}`, 100, 120); // Spacing between label and value

    // Footer text, centered
    doc.setTextColor(150, 150, 150); // Light gray for footer
    doc.setFontSize(10);
    doc.text(
      "Thank you for your payment!",
      doc.internal.pageSize.width / 2,
      150,
      { align: "center" }
    ); // Footer centered below the content

    // Save the PDF
    doc.save("receipt.pdf");
  };

  return (
    <button onClick={generatePDF} className="btn btn-secondary">
      Download Receipt
    </button>
  );
};

export default ReceiptPDFGenerator;
