import playData from "./plays";
import invoiceData from "./invoices";

const statement = (invoice, plays) => {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  // 연극 데이터 추출 함수
  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  // 각각의 연극 공연료 계산 함수
  const amountFor = (aPerformance) => {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy": // 비극
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy": // 희극
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        break;

      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
  };

  // 포인트 적립 함수
  const volumeCreditsFor = (aPerformance) => {
    let result = 0;
    // 포인트 적립
    result += Math.max(aPerformance.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트 제공
    if ("comedy" === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5);
    }

    return result;
  };

  for (const perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
    // 청구 내역 출력
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
};

console.log(statement(invoiceData, playData));
