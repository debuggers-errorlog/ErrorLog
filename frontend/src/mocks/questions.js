/** 질문 mock — API 실패 시 fallback */
import api from "../api/axios.js";

export const MOCK_REQUESTS_RECEIVED = [
    {
        id: 1,
        requesterId: 2,
        requesterNickname: '김개발',
        receiverId: 1,
        receiverNickname: '이멘토',
        title: 'JPA 연관관계 설정이 헷갈려요',
        content:
            '안녕하세요!\n@ManyToOne, @OneToMany 어노테이션을 어느 쪽 엔티티에 선언해야 하는지 헷갈립니다.\n\n예를 들어 User - Post 관계에서 어디에 무엇을 선언해야 할까요?\n이미 여러 블로그를 찾아봤는데 설명이 다 달라서 혼란스럽습니다.\n\n에러 메시지는 따로 없지만 연관 엔티티를 저장할 때 제대로 반영이 안 되는 것 같아서요.',
        status: 'PENDING',
        createdAt: '2026-05-31T10:00:00',
    },
    {
        id: 2,
        requesterId: 3,
        requesterNickname: '박주니어',
        receiverId: 1,
        receiverNickname: '이멘토',
        title: 'Spring Security 필터 체인 질문',
        status: 'ACCEPTED',
        createdAt: '2026-05-29T14:30:00',
    },
    {
        id: 3,
        requesterId: 4,
        requesterNickname: '최백엔드',
        receiverId: 1,
        receiverNickname: '이멘토',
        title: 'Docker 컨테이너 네트워크 설정',
        status: 'REJECTED',
        createdAt: '2026-05-28T09:15:00',
    },
]

export const MOCK_REQUESTS_SENT = [
    {
        id: 4,
        requesterId: 1,
        requesterNickname: '이멘토',
        receiverId: 5,
        receiverNickname: '김시니어',
        title: 'QueryDSL 동적 쿼리 최적화 방법',
        status: 'PENDING',
        createdAt: '2026-05-31T11:00:00',
    },
    {
        id: 5,
        requesterId: 1,
        requesterNickname: '이멘토',
        receiverId: 6,
        receiverNickname: '정풀스택',
        title: 'Redis 캐시 전략 질문드립니다',
        status: 'CANCELED',
        createdAt: '2026-05-29T16:00:00',
    },
]

export const MOCK_REQUEST_DETAIL = {
    id: 1,
    requesterId: 2,
    requesterNickname: '김개발',
    receiverId: 1,
    receiverNickname: '이멘토',
    title: 'JPA 연관관계 설정이 헷갈려요',
    content:
        '안녕하세요!\n@ManyToOne, @OneToMany 어노테이션을 어느 쪽 엔티티에 선언해야 하는지 헷갈립니다.\n\n예를 들어 User - Post 관계에서 어디에 무엇을 선언해야 할까요?\n이미 여러 블로그를 찾아봤는데 설명이 다 달라서 혼란스럽습니다.\n\n에러 메시지는 따로 없지만 연관 엔티티를 저장할 때 제대로 반영이 안 되는 것 같아서요.',
    status: 'PENDING',
    createdAt: '2026-05-31T10:00:00',
    imageUrls: [],
    questionId: null,
}

export const MOCK_REQUEST_DETAIL_ACCEPTED = {
    id: 2,
    requesterId: 3,
    requesterNickname: '박주니어',
    receiverId: 1,
    receiverNickname: '이멘토',
    title: 'Spring Security 필터 체인 질문',
    content:
        'Spring Security 필터 체인 설정에서 특정 경로만 인증을 제외하고 싶은데\npermitAll() 을 써도 계속 401이 납니다.\n\n현재 설정은 아래와 같습니다.\n.requestMatchers("/api/public/**").permitAll()',
    status: 'ACCEPTED',
    createdAt: '2026-05-29T14:30:00',
    imageUrls: [],
    questionId: 1,
}

export const MOCK_QUESTION_DETAIL = {
    id: 1,
    requestId: 2,
    title: 'JPA 연관관계 설정이 헷갈려요',
    content:
        '안녕하세요!\n@ManyToOne, @OneToMany 어노테이션을 어느 쪽 엔티티에 선언해야 하는지 헷갈립니다.\n예를 들어 User - Post 관계에서 어디에 무엇을 선언해야 할까요?',
    status: 'ACTIVE',
    askerId: 2,
    askerNickname: '김개발',
    mentorId: 1,
    mentorNickname: '이멘토',
    createdAt: '2026-05-29T14:30:00',
    answers: [
        {
            id: 1,
            questionId: 1,
            authorId: 2,
            authorNickname: '김개발',
            authorRole: 'ASKER',
            content: '안녕하세요! JPA 연관관계 관련해서 질문드립니다.',
            createdAt: '2026-05-29T14:35:00',
            updatedAt: '2026-05-29T14:35:00',
        },
        {
            id: 2,
            questionId: 1,
            authorId: 1,
            authorNickname: '이멘토',
            authorRole: 'MENTOR',
            content:
                '안녕하세요!\n@ManyToOne 은 "다" 쪽 엔티티(Post)에 선언합니다.\n@OneToMany 는 "일" 쪽 엔티티(User)에 선언하며 보통 mappedBy 로 연결합니다.\n실제 FK 컬럼은 @ManyToOne 쪽 테이블에 생깁니다.',
            createdAt: '2026-05-29T15:00:00',
            updatedAt: '2026-05-29T15:00:00',
        },
        {
            id: 3,
            questionId: 1,
            authorId: 2,
            authorNickname: '김개발',
            authorRole: 'ASKER',
            content: '아 그렇군요! 그럼 지연로딩(LAZY)은 언제 사용하는 게 좋을까요?',
            createdAt: '2026-05-29T15:10:00',
            updatedAt: '2026-05-29T15:10:00',
        },
        {
            id: 4,
            questionId: 1,
            authorId: 1,
            authorNickname: '이멘토',
            authorRole: 'MENTOR',
            content:
                '거의 항상 LAZY를 기본으로 쓰는 게 좋습니다.\nEAGER는 연관 엔티티를 항상 함께 조회하므로 불필요한 쿼리가 발생합니다.\n필요할 때 fetch join 으로 명시적으로 가져오는 패턴을 권장합니다.',
            createdAt: '2026-05-29T15:20:00',
            updatedAt: '2026-05-29T15:20:00',
        },
    ],
}

export const MOCK_REQUEST_DETAIL_REJECTED = {
    id: 3,
    requesterId: 4,
    requesterNickname: '최백엔드',
    receiverId: 1,
    receiverNickname: '이멘토',
    title: 'Docker 컨테이너 네트워크 설정',
    content: 'Docker 컨테이너끼리 통신이 안 됩니다.\nbridge 네트워크를 사용하고 있는데\n서로 ping이 안 가는 상황입니다.',
    status: 'REJECTED',
    createdAt: '2026-05-28T09:15:00',
    imageUrls: [],
    questionId: null,
}

export const MOCK_REQUEST_DETAIL_PENDING_SENT = {
    id: 4,
    requesterId: 1,
    requesterNickname: '이멘토',
    receiverId: 5,
    receiverNickname: '김시니어',
    title: 'QueryDSL 동적 쿼리 최적화 방법',
    content: 'QueryDSL로 동적 쿼리를 작성하고 있는데\n조건이 많아질수록 성능이 떨어집니다.\n최적화 방법이 궁금합니다.',
    status: 'PENDING',
    createdAt: '2026-05-31T11:00:00',
    imageUrls: [],
    questionId: null,
}

export const MOCK_REQUEST_DETAIL_CANCELED = {
    id: 5,
    requesterId: 1,
    requesterNickname: '이멘토',
    receiverId: 6,
    receiverNickname: '정풀스택',
    title: 'Redis 캐시 전략 질문드립니다',
    content: 'Redis를 캐시로 사용할 때\nLRU vs LFU 중 어떤 전략이 적합한지 궁금합니다.',
    status: 'CANCELLED',
    createdAt: '2026-05-29T16:00:00',
    imageUrls: [],
    questionId: null,
}

export const getRequestDetail = (requestId) =>
    api.get(`/questions/requests/${requestId}`)

export const acceptRequest = async (requestId, body) => {
    const res = await api.post(`/questions/requests/${requestId}/accept`, body)
    return res.data.data
}

export const MOCK_MY_QUESTIONS_ASKER = [
    {
        id: 1,
        title: 'JPA 연관관계 설정이 헷갈려요',
        askerNickname: '김개발',
        mentorNickname: '이멘토',
        status: 'ACTIVE',
        answerCount: 4,
        createdAt: '2026-05-29T14:30:00',
    },
]

export const MOCK_MY_QUESTIONS_MENTOR = [
    {
        id: 2,
        title: 'Spring Security 필터 체인 질문',
        askerNickname: '박주니어',
        mentorNickname: '이멘토',
        status: 'ACTIVE',
        answerCount: 2,
        createdAt: '2026-05-28T10:00:00',
    },
]