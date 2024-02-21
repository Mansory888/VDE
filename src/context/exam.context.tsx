import { createContext, useState, ReactNode } from 'react';
import { MockExam } from '../models/mockExam';

interface ExamContextType {
    exam: MockExam | null;
    setExam: (exam: MockExam | null) => void;
}

export const ExamContext = createContext<ExamContextType>({
    exam: null,
    setExam: () => { },
});

interface ExamProviderProps {
    children: ReactNode;
}

export const ExamProvider = ({ children }: ExamProviderProps) => {
    const [exam, setExam] = useState<MockExam | null>(null);

    return (
        <ExamContext.Provider value={{ exam, setExam }}>
            {children}
        </ExamContext.Provider>
    );
};
