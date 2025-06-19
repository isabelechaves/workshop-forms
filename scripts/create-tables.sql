-- Create table for etiquette test responses
CREATE TABLE IF NOT EXISTS etiquette_test_responses (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255),
    answers INTEGER[] NOT NULL,
    total_points INTEGER NOT NULL,
    result_text TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for case study responses
CREATE TABLE IF NOT EXISTS case_study_responses (
    id SERIAL PRIMARY KEY,
    form_number INTEGER NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255),
    case_title VARCHAR(255) NOT NULL,
    answers TEXT[] NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_etiquette_student_name ON etiquette_test_responses(student_name);
CREATE INDEX IF NOT EXISTS idx_etiquette_completed_at ON etiquette_test_responses(completed_at);
CREATE INDEX IF NOT EXISTS idx_case_study_student_name ON case_study_responses(student_name);
CREATE INDEX IF NOT EXISTS idx_case_study_form_number ON case_study_responses(form_number);
CREATE INDEX IF NOT EXISTS idx_case_study_completed_at ON case_study_responses(completed_at);
