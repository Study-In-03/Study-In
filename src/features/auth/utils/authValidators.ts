// 이메일 유효성 검사 (기본적인 이메일 형식: a@b.c)
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 비밀번호 유효성 검사 (영문, 숫자, 특수 문자 포함 8자 이상)
export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;
    return passwordRegex.test(password);
};