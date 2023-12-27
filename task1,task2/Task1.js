function addItAsync(x, y) {
    return new Promise((resolve, reject) => {
      if (typeof x !== 'number' || typeof y !== 'number') {
        reject(new Error('Both inputs must be numbers'));
      } else {
        const sum = x + y;
        resolve(sum);
      }
    });
  }
  
  async function main() {
    try {
      const num1 = 'a';
      const num2 = 7;
  
      console.log(`First Number =  ${num1} and Second Number = ${num2}`);
      const result = await addItAsync(num1, num2);
      console.log(`Addition: ${num1} + ${num2}`);
      console.log(`Result: ${result}`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  main();
  