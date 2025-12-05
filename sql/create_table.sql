/* my sql 이용 */
/* 1. 사용자 테이블 (Users) */
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    nick VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/* 2. 그룹 테이블 (Groups) */
/* 그룹 이름과 입장 코드를 관리 */
CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,          -- 그룹 이름 (예: 캡스톤디자인조)
    code VARCHAR(20) NOT NULL UNIQUE,   -- 입장 코드 !!!!!!!!!!!!!!(랜덤으로 만들기 하고싶으니 다시 살펴보기!)!!!!!
    ownerId INT NOT NULL,               -- 방장 ID (그룹 만든 사람)
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
);

/* 3. 그룹 멤버 테이블 (GroupMembers) */
/* 누가 어느 그룹에 속해있는지 연결 (N:M) */
CREATE TABLE groupMembers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    groupId INT NOT NULL,
    joinedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE KEY (userId, groupId) -- 한 사람이 같은 그룹에 중복 가입 방지
);

/* 4. 투두 테이블 (Todos) */
/* 개인 할 일과 그룹 할 일을 모두 저장 */
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(200) NOT NULL,      -- 할 일 내용
    status TINYINT(1) DEFAULT 0,        -- 0:대기, 1:완료 (진행상태)
    targetDate DATE NOT NULL,           -- 목표 날짜 (캘린더 표시용)
    
    assigneeId INT NOT NULL,            -- 담당자 (이 일을 해야 할 사람)
    groupId INT DEFAULT NULL,           -- NULL이면 '개인 할 일', 값이 있으면 '그룹 할 일'
    
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigneeId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
);