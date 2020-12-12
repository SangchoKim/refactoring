import playData from "./plays";
import invoiceData from "./invoices";

const statement = (invoice, plays) => {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  // format 함수
  const usd = (aNumber) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100); // 단위 변환 로직 안으로 이동
  };

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

  // 값 계산 로직 함수
  const totalVolumeCredist = () => {
    let result = 0;
    for (const perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  };

  // 토탈 값 계산 로직 함수
  const totalAmount = () => {
    let result = 0;
    for (const perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  };

  for (const perf of invoice.performances) {
    // 청구 내역 출력
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredist()}점\n`; // 변수 인라인
  return result;
};

console.log(statement(invoiceData, playData));
