import { ref } from 'firebase/database';
import { db } from './firebase-config.js';
import { onValue } from 'firebase/database';

async function Defaulted() {
  return new Promise((resolve, reject) => {
    const dbRef = ref(db, 'clients');
    
    onValue(dbRef, (snapshot) => {
      const response = snapshot.val();
      if (response) {
        const responseArray = Object.values(response);
        // console.log('my data: ', responseArray);
        resolve(responseArray);
      } else {
        console.log('response is undefined');
        resolve([]);
      }
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.name);
      reject(errorObject);
    });
  });
}

export default Defaulted;
