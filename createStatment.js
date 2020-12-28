// 공연료, 적립포인트 계산기 함수 
class PerformanceCalculator {
  constructor (aPerformance, aplay){
    this.performance = aPerformance;
    this.play = aplay; // 공연 정보 
  }

   // 포인트 적립 함수
   get volumeCredits(){
     // 일반적인 계산 방법
    return Math.max(this.performance.audience - 30, 0);
  }

   // 각각의 연극 공연료 계산 함수
  get amount(){ 
    throw '서브클래스에서 처리하도록 설계되었습니다.' // 공연료는 서브클래스에서 계산하도록 유도
  }
}

// 희극 공연료 계산 클래스
class ComedyCalculator extends PerformanceCalculator{

   // 포인트 적립 함수
   get volumeCredits(){
     // 일반적인 계산 방법에서 오버라이드를 함.
    return super.volumeCredits +  Math.floor(this.performance.audience / 5);
  }
  // 각각의 연극 공연료 계산 함수
  get amount(){ 
     let result = 30000;
      if (this.performance.audience > 20) {
        result += 10000 + 500 * (this.performance.audience - 20);
      }
      result += 300 * this.performance.audience;
      return result;
 }
}

// 비극 공연료 계산 클래스
class TragedyCalculator extends PerformanceCalculator{
  // 각각의 연극 공연료 계산 함수
   get amount(){ 
      let result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
       return result;
  }
}

// 팩터리 함수 
const createPerformanceCalculator = (aPerformance, aplay) => {
  switch (aplay.type) {
    case "tragedy": return new TragedyCalculator(aPerformance, aplay);
    case "comedy": return new ComedyCalculator(aPerformance, aplay);
    default:
      throw new Error(`알 수없는 장르: ${aplay.type}`);
  }
}

// 필요한 데이터 처리하는 함수
export default function createStatementData(invoice, plays) {
  const result = {};

  // 공연 정보 데이터 셋팅함수
  const enrichPerformance = (aPerformance) => {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); // 생성자 대신 팩터리 함수 호출
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = calculator.play;
    result.amount = calculator.amount; 
    result.volumeCredits = calculator.volumeCredits; 
    return result;
  };

  // 연극 데이터 추출 함수
  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
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
