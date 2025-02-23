import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as xlsx from 'xlsx';
import VADER from 'sentiment';

jest.mock('xlsx');
jest.mock('sentiment');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Detailed Analysis')).toBeInTheDocument();
  });

  it('Dark Mode Toggle', () => {
    render(<App />);
    const darkModeToggle = screen.getByTestId('dark-mode-toggle');
    fireEvent.click(darkModeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(darkModeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('File Upload', async () => {
    const mockData = [
      { issue_key: '1', team_id: 1, sprint: 'Sprint 1', updated: '2023-01-01', What_went_well: 'Good', What_did_not_go_well: 'Bad',Domain:'Test' },
      { issue_key: '2', team_id: 2, sprint: 'Sprint 2', updated: '2023-01-02', What_went_well: 'Great', What_did_not_go_well: 'Terrible', Domain:'Test2' },
    ];
    const mockSheet = { '!ref': 'A1:Z2', A1: { v: 'issue_key' }, B1: { v: 'team_id' }, C1: {v: 'sprint'}, D1: {v:'updated'}, E1: { v:'What_went_well'}, F1: {v:'What_did_not_go_well'}, G1: {v:'Domain'}, A2: {v: '1'}, B2: {v: 1}, C2: { v: 'Sprint 1'}, D2: { v: '2023-01-01'}, E2: { v: 'Good'}, F2: {v: 'Bad'}, G2: {v: 'Test'}, A3: {v:'2'}, B3: { v: 2}, C3: {v: 'Sprint 2'}, D3: { v: '2023-01-02'}, E3: { v: 'Great'}, F3: { v:'Terrible'}, G3: {v: 'Test2'} };
    const mockWorkBook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: mockSheet } };

    (xlsx.read as jest.Mock).mockReturnValue(mockWorkBook);
    (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (VADER.prototype.analyze as jest.Mock).mockImplementation((text:string)=>{
      if(text == 'Good') { return {score: 0.5} }
      if(text == 'Great') { return {score: 1.0}}
      if(text == 'Bad') { return {score: -0.5}}
      if(text == 'Terrible') { return {score: -1.0}}
    });

    render(<App />);
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
        expect(xlsx.read).toHaveBeenCalled();
        expect(xlsx.utils.sheet_to_json).toHaveBeenCalled();
        expect(VADER.prototype.analyze).toHaveBeenCalled();
    });
  });

  it('Data Filtering', async () => {
    const mockData = [
      { issueKey: '1', teamId: 1, sprint: 'Sprint 1', updated: '2023-01-01', What_went_well: 'Good', What_did_not_go_well: 'Bad', sentimentScore: 0.5, Domain: 'Test' },
      { issueKey: '2', teamId: 2, sprint: 'Sprint 2', updated: '2023-01-02', What_went_well: 'Great', What_did_not_go_well: 'Terrible', sentimentScore: -0.5, Domain: 'Test2'},
      { issueKey: '3', teamId: 1, sprint: 'Sprint 2', updated: '2023-01-03', What_went_well: 'Good', What_did_not_go_well: 'Bad', sentimentScore: 0.2, Domain: 'Test3'},
    ];

    const mockSheet = { '!ref': 'A1:Z3', A1: { v: 'issueKey' }, B1: { v: 'teamId' }, C1: {v: 'sprint'}, D1: {v:'updated'}, E1: { v:'What_went_well'}, F1: {v:'What_did_not_go_well'}, G1: {v:'sentimentScore'}, H1:{v: 'Domain'}, A2: {v: '1'}, B2: {v: 1}, C2: { v: 'Sprint 1'}, D2: { v: '2023-01-01'}, E2: { v: 'Good'}, F2: {v: 'Bad'}, G2: {v: 0.5}, H2: {v:'Test'}, A3: {v:'2'}, B3: { v: 2}, C3: {v: 'Sprint 2'}, D3: { v: '2023-01-02'}, E3: { v: 'Great'}, F3: { v:'Terrible'}, G3: {v: -0.5}, H3: {v: 'Test2'}, A4: {v:'3'}, B4: { v: 1}, C4: {v: 'Sprint 2'}, D4: { v: '2023-01-03'}, E4: { v: 'Good'}, F4: { v:'Bad'}, G4: {v: 0.2}, H4: {v:'Test3'} };
    const mockWorkBook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: mockSheet } };

    (xlsx.read as jest.Mock).mockReturnValue(mockWorkBook);
    (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (VADER.prototype.analyze as jest.Mock).mockImplementation((text:string)=>{
      if(text == 'Good') { return {score: 0.5} }
      if(text == 'Great') { return {score: 1.0}}
      if(text == 'Bad') { return {score: -0.5}}
      if(text == 'Terrible') { return {score: -1.0}}
    });

    render(<App />);
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(screen.getByText('Detailed Analysis')).toBeInTheDocument());

    const teamIdFilter = screen.getByLabelText('team-select');
    fireEvent.change(teamIdFilter, { target: { value: '1' } });

    const sprintFilter = screen.getByLabelText('sprint-select');
    fireEvent.change(sprintFilter, { target: { value: 'Sprint 2' } });

    const sentimentFilter = screen.getByLabelText('sentiment-select');
    fireEvent.change(sentimentFilter, {target: { value: 'neutral'}});

    const domainFilter = screen.getByLabelText('domain-select');
    fireEvent.change(domainFilter, {target: { value: 'Test3'}});

    await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(2);
    });
  });

  it('KPI Cards', async () => {
    const mockData = [
      { issueKey: '1', teamId: 1, sprint: 'Sprint 1', updated: '2023-01-01', What_went_well: 'Good', What_did_not_go_well: 'Bad', sentimentScore: 0.5, Domain: 'Test' },
      { issueKey: '2', teamId: 2, sprint: 'Sprint 2', updated: '2023-01-02', What_went_well: 'Great', What_did_not_go_well: 'Terrible', sentimentScore: -0.5, Domain: 'Test2' },
    ];
    const mockSheet = { '!ref': 'A1:Z2', A1: { v: 'issueKey' }, B1: { v: 'teamId' }, C1: {v: 'sprint'}, D1: {v:'updated'}, E1: { v:'What_went_well'}, F1: {v:'What_did_not_go_well'}, G1: {v:'sentimentScore'}, H1:{v: 'Domain'}, A2: {v: '1'}, B2: {v: 1}, C2: { v: 'Sprint 1'}, D2: { v: '2023-01-01'}, E2: { v: 'Good'}, F2: {v: 'Bad'}, G2: {v: 0.5}, H2: {v:'Test'}, A3: {v:'2'}, B3: { v: 2}, C3: {v: 'Sprint 2'}, D3: { v: '2023-01-02'}, E3: { v: 'Great'}, F3: { v:'Terrible'}, G3: {v: -0.5}, H3: {v: 'Test2'} };
    const mockWorkBook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: mockSheet } };

    (xlsx.read as jest.Mock).mockReturnValue(mockWorkBook);
    (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (VADER.prototype.analyze as jest.Mock).mockImplementation((text:string)=>{
      if(text == 'Good') { return {score: 0.5} }
      if(text == 'Great') { return {score: 1.0}}
      if(text == 'Bad') { return {score: -0.5}}
      if(text == 'Terrible') { return {score: -1.0}}
    });

    render(<App />);
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Average Sentiment')).toBeInTheDocument();
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Stories Delivered')).toBeInTheDocument();
      expect(screen.getByText('Communication Score')).toBeInTheDocument();
    });

    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('Sentiment Distribution Chart', async () => {
    const mockData = [
      { issueKey: '1', teamId: 1, sprint: 'Sprint 1', updated: '2023-01-01', What_went_well: 'Good', What_did_not_go_well: 'Bad', sentimentScore: 0.8, Domain: 'Test' },
      { issueKey: '2', teamId: 2, sprint: 'Sprint 2', updated: '2023-01-02', What_went_well: 'Great', What_did_not_go_well: 'Terrible', sentimentScore: -0.8, Domain: 'Test2' },
    ];
    const mockSheet = { '!ref': 'A1:Z2', A1: { v: 'issueKey' }, B1: { v: 'teamId' }, C1: {v: 'sprint'}, D1: {v:'updated'}, E1: { v:'What_went_well'}, F1: {v:'What_did_not_go_well'}, G1: {v:'sentimentScore'}, H1:{v: 'Domain'}, A2: {v: '1'}, B2: {v: 1}, C2: { v: 'Sprint 1'}, D2: { v: '2023-01-01'}, E2: { v: 'Good'}, F2: {v: 'Bad'}, G2: {v: 0.8}, H2: {v:'Test'}, A3: {v:'2'}, B3: { v: 2}, C3: {v: 'Sprint 2'}, D3: { v: '2023-01-02'}, E3: { v: 'Great'}, F3: { v:'Terrible'}, G3: {v: -0.8}, H3: {v: 'Test2'} };
    const mockWorkBook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: mockSheet } };

    (xlsx.read as jest.Mock).mockReturnValue(mockWorkBook);
    (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (VADER.prototype.analyze as jest.Mock).mockImplementation((text:string)=>{
      if(text == 'Good') { return {score: 0.5} }
      if(text == 'Great') { return {score: 1.0}}
      if(text == 'Bad') { return {score: -0.5}}
      if(text == 'Terrible') { return {score: -1.0}}
    });

    render(<App />);
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('Sentiment Distribution')).toBeInTheDocument();
    });
    expect(screen.getByText('Positive')).toBeInTheDocument();
    expect(screen.getByText('Negative')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });

  it('Team Sentiment Overview Chart', async () => {
    const mockData = [
      { issueKey: '1', teamId: 1, sprint: 'Sprint 1', updated: '2023-01-01', What_went_well: 'Good', What_did_not_go_well: 'Bad', sentimentScore: 0.8, Domain: 'Test', whatWentWellScore: 0.5, whatDidNotGoWellScore: -0.5 },
      { issueKey: '2', teamId: 2, sprint: 'Sprint 2', updated: '2023-01-02', What_went_well: 'Great', What_did_not_go_well: 'Terrible', sentimentScore: -0.8, Domain: 'Test2', whatWentWellScore: 1.0, whatDidNotGoWellScore: -1.0 },
    ];
    const mockSheet = { '!ref': 'A1:Z2', A1: { v: 'issueKey' }, B1: { v: 'teamId' }, C1: {v: 'sprint'}, D1: {v:'updated'}, E1: { v:'What_went_well'}, F1: {v:'What_did_not_go_well'}, G1: {v:'sentimentScore'}, H1:{v: 'Domain'}, I1:{v:'whatWentWellScore'}, J1:{v: 'whatDidNotGoWellScore'}, A2: {v: '1'}, B2: {v: 1}, C2: { v: 'Sprint 1'}, D2: { v: '2023-01-01'}, E2: { v: 'Good'}, F2: {v: 'Bad'}, G2: {v: 0.8}, H2: {v:'Test'}, I2: {v: 0.5}, J2:{v: -0.5}, A3: {v:'2'}, B3: { v: 2}, C3: {v: 'Sprint 2'}, D3: { v: '2023-01-02'}, E3: { v: 'Great'}, F3: { v:'Terrible'}, G3: {v: -0.8}, H3: {v: 'Test2'}, I3: {v: 1.0}, J3: {v: -1.0} };
    const mockWorkBook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: mockSheet } };

    (xlsx.read as jest.Mock).mockReturnValue(mockWorkBook);
    (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (VADER.prototype.analyze as jest.Mock).mockImplementation((text:string)=>{
      if(text == 'Good') { return {score: 0.5} }
      if(text == 'Great') { return {score: 1.0}}
      if(text == 'Bad') { return {score: -0.5}}
      if(text == 'Terrible') { return {score: -1.0}}
    });

    render(<App />);
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Team Sentiment Overview')).toBeInTheDocument();
      expect(screen.getByText('What went well')).toBeInTheDocument();
      expect(screen.getByText('What did not go well')).toBeInTheDocument();
    });
  });

  it('Data Grid', async () => {
    const mockData = [
      { issueKey: '1', teamId: 1, sprint: 'Sprint 1', updated: '2023-01-01', What_went_well: 'Good', What_did_not_go_well: 'Bad', sentimentScore: 0.5, Domain:'Test' },
      { issueKey: '2', teamId: 2, sprint: 'Sprint 2', updated: '2023-01-02', What_went_well: 'Great', What_did_not_go_well: 'Terrible', sentimentScore: -0.5, Domain:'Test2'},
    ];

    const mockSheet = { '!ref': 'A1:Z2', A1: { v: 'issueKey' }, B1: { v: 'teamId' }, C1: {v: 'sprint'}, D1: {v:'updated'}, E1: { v:'What_went_well'}, F1: {v:'What_did_not_go_well'}, G1: {v:'sentimentScore'}, H1: {v: 'Domain'}, A2: {v: '1'}, B2: {v: 1}, C2: { v: 'Sprint 1'}, D2: { v: '2023-01-01'}, E2: { v: 'Good'}, F2: {v: 'Bad'}, G2: {v: 0.5}, H2: {v:'Test'}, A3: {v:'2'}, B3: { v: 2}, C3: {v: 'Sprint 2'}, D3: { v: '2023-01-02'}, E3: { v: 'Great'}, F3: { v:'Terrible'}, G3: {v: -0.5}, H3: {v:'Test2'} };
    const mockWorkBook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: mockSheet } };

    (xlsx.read as jest.Mock).mockReturnValue(mockWorkBook);
    (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (VADER.prototype.analyze as jest.Mock).mockImplementation((text:string)=>{
      if(text == 'Good') { return {score: 0.5} }
      if(text == 'Great') { return {score: 1.0}}
      if(text == 'Bad') { return {score: -0.5}}
      if(text == 'Terrible') { return {score: -1.0}}
    });

    render(<App />);
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3);
    });
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('0.5')).toBeInTheDocument();
  });
});