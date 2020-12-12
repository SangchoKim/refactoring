// 필요한 데이터 처리하는 함수
export default function createStatementData(invoice, plays) {
  const result = {};

  // 공연 정보 데이터 셋팅함수
  const enrichPerformance = (aPerformance) => {
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result); // 적립 포인트 계산 함수 추가
    return result;
  };

  // 연극 데이터 추출 함수
  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  // 각각의 연극 공연료 계산 함수
  const amountFor = (aPerformance) => {
    let result = 0;
    switch (aPerformance.play.type) {
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
        throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
    }
    return result;
  };

  // 포인트 적립 함수
  const volumeCreditsFor = (aPerformance) => {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트 제공
    if ("comedy" === aPerformance.play.type) {
      result += Math.floor(aPerformance.audience / 5);
    }

    return result;
  };

  // 값 계산 로직 함수
  const totalVolumeCredist = (data) => {
    // for 반목문을 파이프문으로 변경
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  };

  // 토탈 값 계산 로직 함수
  const totalAmount = (data) => {
    // for 반목문을 파이프문으로 변경
    return data.performances.reduce((total, p) => total + p.amount, 0);
  };

  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredist = totalVolumeCredist(result);

  return result;
}
