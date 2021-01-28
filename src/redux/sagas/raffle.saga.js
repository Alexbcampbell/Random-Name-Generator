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

function* getRaffleEntry(action) {
  try {
    const response = yield axios.get(`/api/raffle`);
    yield put({
      type: 'SET_RAFFLE_ENTRY',
      payload: response.data,
    });
    console.log('look HERE get raffle entries', response.data);
  } catch (err) {
    console.log('error getting raffle entries', err);
    yield put({ type: 'GET_RAFFLE_ENTRY_FAILED' });
  }
}

function* raffleSaga() {
  yield takeLatest('POST_RAFFLE_ENTRY', postRaffleEntry);
  yield takeLatest('GET_RAFFLE_ENTRY', getRaffleEntry);
}

export default raffleSaga;
