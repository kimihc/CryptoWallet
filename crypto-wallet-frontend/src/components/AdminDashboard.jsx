import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

const AdminDashboard = () => {
  const { user, allUsers, updateUserByLogin, logout } = useContext(AuthContext);
  const { theme: themeMode } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState([]);
  const [appointDialogOpen, setAppointDialogOpen] = useState(false);
  const [appointLogin, setAppointLogin] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [usersPage, setUsersPage] = useState(1);
  const [employeesPage, setEmployeesPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
    }

    const updatedFilteredUsers = allUsers.filter(u => {
      if (!u.login || u.login.trim() === '') {
        return false;
      }
      return (u.role !== 'Admin' && u.role !== 'Employee' && !u.isBanned);
    });
    setFilteredUsers(updatedFilteredUsers);

    const reportKeys = Object.keys(localStorage).filter(key => key.startsWith('employeeReport_'));
    const loadedReports = reportKeys.map(key => ({
      key,
      data: JSON.parse(localStorage.getItem(key))
    }));
    setReports(loadedReports);
  }, [user, navigate, allUsers]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBanUser = (userLogin) => {
    updateUserByLogin(userLogin, { isBanned: true });
  };

  const handleAppointEmployee = () => {
    if (appointLogin) {
      updateUserByLogin(appointLogin, { role: 'Employee' });
      setAppointDialogOpen(false);
      setAppointLogin('');
    }
  };

  const handleFireEmployee = (userLogin) => {
    updateUserByLogin(userLogin, { role: null });
  };

  const texts = {
    ru: {
      dashboard: "Панель администратора",
      usersTab: "Список пользователей",
      employeesTab: "Список сотрудников",
      reportsTab: "Отчеты сотрудников",
      login: "Логин",
      role: "Роль",
      kycStatus: "Статус KYC",
      actions: "Действия",
      ban: "Забанить",
      appoint: "Назначить сотрудником",
      fire: "Уволить",
      report: "Отчет",
      action: "Действие",
      target: "Цель",
      details: "Детали",
      logout: "Выйти",
      appointEmployee: "Назначить сотрудника",
      enterLogin: "Выберите пользователя"
    },
    en: {
      dashboard: "Admin Dashboard",
      usersTab: "Users List",
      employeesTab: "Employees List",
      reportsTab: "Employee Reports",
      login: "Login",
      role: "Role",
      kycStatus: "KYC Status",
      actions: "Actions",
      ban: "Ban",
      appoint: "Appoint Employee",
      fire: "Fire",
      report: "Report",
      action: "Action",
      target: "Target",
      details: "Details",
      logout: "Logout",
      appointEmployee: "Appoint Employee",
      enterLogin: "Select a user"
    }
  };

  const theme = createTheme({
    palette: {
      mode: themeMode === 'dark' ? 'dark' : 'light',
      primary: {
        main: '#7c3aed',
      },
      secondary: {
        main: '#F7931A',
      },
      background: {
        default: themeMode === 'dark' ? '#1A1E34' : '#f5f5f5',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  const paginatedUsers = filteredUsers.slice((usersPage - 1) * rowsPerPage, usersPage * rowsPerPage);
  const paginatedEmployees = allUsers.filter(u => u.role === 'Employee' && u.login && u.login.trim() !== '').slice((employeesPage - 1) * rowsPerPage, employeesPage * rowsPerPage);
  const paginatedReports = reports.slice((reportsPage - 1) * rowsPerPage, reportsPage * rowsPerPage);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 5 }, background: themeMode === 'dark' ? 'linear-gradient(135deg, #1e1e1e, #2a2a2a)' : 'linear-gradient(135deg, #ffffff, #f0f4f8)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h3" color="text.primary" fontWeight="bold">
                {texts[language].dashboard}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
              >
                {texts[language].logout}
              </Button>
            </Box>

            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 4 }}>
              <Tab label={texts[language].usersTab} />
              <Tab label={texts[language].employeesTab} />
              <Tab label={texts[language].reportsTab} />
            </Tabs>

            {tabValue === 0 && (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{texts[language].login}</TableCell>
                        <TableCell>{texts[language].role}</TableCell>
                        <TableCell>{texts[language].kycStatus}</TableCell>
                        <TableCell>{texts[language].actions}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedUsers.map((u) => (
                        <TableRow key={u.login}>
                          <TableCell>{u.login || 'N/A'}</TableCell>
                          <TableCell>{u.role || 'User'}</TableCell>
                          <TableCell>{u.kycStatus || 'N/A'}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleBanUser(u.login)}
                              sx={{ mr: 1 }}
                            >
                              {texts[language].ban}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(filteredUsers.length / rowsPerPage)}
                    page={usersPage}
                    onChange={(event, value) => setUsersPage(value)}
                    color="primary"
                  />
                </Box>
              </>
            )}

            {tabValue === 1 && (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{texts[language].login}</TableCell>
                        <TableCell>{texts[language].role}</TableCell>
                        <TableCell>{texts[language].actions}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedEmployees.map((u) => (
                        <TableRow key={u.login}>
                          <TableCell>{u.login || 'N/A'}</TableCell>
                          <TableCell>{u.role}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleFireEmployee(u.login)}
                              sx={{ mr: 1 }}
                            >
                              {texts[language].fire}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setAppointDialogOpen(true)}
                          >
                            {texts[language].appoint}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(allUsers.filter(u => u.role === 'Employee' && u.login && u.login.trim() !== '').length / rowsPerPage)}
                    page={employeesPage}
                    onChange={(event, value) => setEmployeesPage(value)}
                    color="primary"
                  />
                </Box>
                <Dialog open={appointDialogOpen} onClose={() => setAppointDialogOpen(false)}>
                  <DialogTitle>{texts[language].appointEmployee}</DialogTitle>
                  <DialogContent>
                    <Select
                      value={appointLogin}
                      onChange={(e) => setAppointLogin(e.target.value)}
                      fullWidth
                      displayEmpty
                      renderValue={(selected) => selected || texts[language].enterLogin}
                    >
                      <MenuItem value="" disabled>
                        {texts[language].enterLogin}
                      </MenuItem>
                      {filteredUsers.map((u) => (
                        <MenuItem key={u.login} value={u.login}>
                          {u.login}
                        </MenuItem>
                      ))}
                    </Select>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setAppointDialogOpen(false)}>Назад</Button>
                    <Button onClick={handleAppointEmployee} disabled={!appointLogin}>Назначить</Button>
                  </DialogActions>
                </Dialog>
              </>
            )}

            {tabValue === 2 && (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{texts[language].report}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedReports.map((report) => (
                        <TableRow key={report.key}>
                          <TableCell>
                            <TableContainer component={Paper} sx={{ p: 2, mb: 2 }}>
                              <Table>
                                <TableBody>
                                  {report.data.map((entry, index) => (
                                    <React.Fragment key={index}>
                                      <TableRow>
                                        <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>
                                          {texts[language].action}
                                        </TableCell>
                                        <TableCell>{entry.action}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>
                                          {texts[language].target}
                                        </TableCell>
                                        <TableCell>{entry.target}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>
                                          {texts[language].details}
                                        </TableCell>
                                        <TableCell>{entry.details}</TableCell>
                                      </TableRow>
                                      {index < report.data.length - 1 && (
                                        <TableRow>
                                          <TableCell colSpan={2}>
                                            <Divider sx={{ my: 1 }} />
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(reports.length / rowsPerPage)}
                    page={reportsPage}
                    onChange={(event, value) => setReportsPage(value)}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;