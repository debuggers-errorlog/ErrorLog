import client from './client';
import {
    MOCK_REQUESTS_RECEIVED,
    MOCK_REQUESTS_SENT,
    MOCK_QUESTION_DETAIL,
    MOCK_MY_QUESTIONS_ASKER,
    MOCK_MY_QUESTIONS_MENTOR,
} from '../mocks/questions';


export async function sendQuestionRequest(dto) {
    const { data } = await client.post('/questions/requests', dto);
    return data.data;
}

export async function getReceivedRequests() {
    try {
        const { data } = await client.get('/questions/requests/received');
        return data.data ?? [];
    } catch {
        return MOCK_REQUESTS_RECEIVED;
    }
}

export async function getSentRequests() {
    try {
        const { data } = await client.get('/questions/requests/sent');
        return data.data ?? [];
    } catch {
        return MOCK_REQUESTS_SENT;
    }
}

export async function getRequestDetail(requestId) {
    try {
        const { data } = await client.get(`/questions/requests/${requestId}`);
        return data.data;
    } catch {
        return MOCK_REQUESTS_RECEIVED[0];
    }
}


export async function acceptRequest(requestId) {
    const { data } = await client.post(`/questions/requests/${requestId}/accept`);
    return data.data;
}

export async function rejectRequest(requestId) {
    await client.post(`/questions/requests/${requestId}/reject`);
}

export async function cancelRequest(requestId) {
    await client.delete(`/questions/requests/${requestId}`);
}

export async function getQuestionDetail(questionId) {
    try {
        const { data } = await client.get(`/questions/${questionId}`);
        return data.data;
    } catch {
        return MOCK_QUESTION_DETAIL;
    }
}

export async function getMyQuestionsAsAsker() {
    try {
        const { data } = await client.get('/questions/my/asker');
        return data.data ?? [];
    } catch {
        return MOCK_MY_QUESTIONS_ASKER;
    }
}

export async function getMyQuestionsAsMentor() {
    try {
        const { data } = await client.get('/questions/my/mentor');
        return data.data ?? [];
    } catch {
        return MOCK_MY_QUESTIONS_MENTOR;
    }
}


export async function writeAnswer(questionId, dto) {
    const { data } = await client.post(`/questions/${questionId}/answers`, dto);
    return data.data;
}

export async function updateAnswer(answerId, dto) {
    const { data } = await client.put(`/questions/answers/${answerId}`, dto);
    return data.data;
}

export async function deleteAnswer(answerId) {
    await client.delete(`/questions/answers/${answerId}`);
}