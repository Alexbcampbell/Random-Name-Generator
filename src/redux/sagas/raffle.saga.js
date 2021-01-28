import { put, take, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* postRaffleEntry(action) {
  try {
    yield axios.post(`/api/raffle`, action.payload);
  } catch (err) {
    console.log('ERROR SAVING ENTRY', err);
    yield put({ type: 'POST_FAILED' });
  }
}

function* raffleSaga() {
  yield takeLatest('POST_RAFFLE_ENTRY', postRaffleEntry);
}

export default registrationSaga;
