import playData from "./plays";
import invoiceData from "./invoices";
import createStatementData from "./createStatment";

// 영수증을 만드는 함수
const statement = (invoice, plays) => {
  return renderPlainText(createStatementData(invoice, plays));
};

// format 함수
const usd = (aNumber) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
};

// HTML로 출력하는 함수
const renderPlainText = (data) => {
  let result = `청구 내역 (고객명: ${data.customer})\n`;

  for (const perf of data.performances) {
    // 청구 내역 출력
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredist}점\n`;
  return result;
};

// 영수증을 출력하여 dom에 올려주는 실행 함수
const htmlStatement = (invoice, plays) => {
  return renderHtml(createStatementData(invoice, plays));
};

// html로 출력할 수 있도록 만드는 함수
const renderHtml = (data) => {
  let result = `<h1>청구내역 (고객명: ${data.customer})</h1>\n`;
  result += `<table>\n`;
  result += `<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>`;

  for (const perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td>${perf.audience}석</tr>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += `</table>\n`;
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredist}</em>점</p>\n`;

  return result;
};

console.log(statement(invoiceData, playData));
// console.log(htmlStatement(invoiceData, playData));
