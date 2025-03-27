import { Query } from "./types";
import { mockQueries } from "./data";
import { useCallback, useState } from "react";
import { useTheme } from "./context/theme-context";
import { useRateLimiter } from "./hooks/useRateLimiter";

// custom components
import DataTable from "./components/data-table";
import QueryInput from "./components/query-input";
import QueryHistory from "./components/query-history";
import VirtualTable from "./components/virtual-table";
import SkeletonTable from "./components/table-skeleton";
import QuerySelector from "./components/query-selector";

// material-ui components
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function App() {
  const { mode, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [history, setHistory] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query>(mockQueries[0]);
  const [customQuery, setCustomQuery] = useState<string>(mockQueries[0].query);

  const { canMakeRequest, addRequestTimestamp, rateLimitMessage } =
    useRateLimiter();

  const handleRunQuery = () => {
    if (!canMakeRequest()) {
      return;
    }

    setIsLoading(true);
    addRequestTimestamp();

    if (customQuery.trim() === "") {
      setIsLoading(false);
      setQueryError("Query cannot be empty");
      return;
    }

    setQueryError(null);

    // added a dummy timeout to simulate an API call and show the loading state
    setTimeout(() => {
      const normalizedQuery = customQuery.toLowerCase().trim();

      const tableMatch = normalizedQuery.match(/^select\s+\*\s+from\s+(\w+)/i);

      if (tableMatch) {
        const tableName = tableMatch[1].toLowerCase();

        const baseQuery = mockQueries.find(
          (q) => q.query.toLowerCase().trim() === `select * from ${tableName};`
        );

        if (baseQuery) {
          setSelectedQuery(baseQuery);
          setHistory((prev) => [baseQuery, ...prev.slice(0, 4)]);
        } else {
          setSelectedQuery({
            id: 0,
            query: "No matching query found",
            data: [],
          });
          setHistory((prev) => [
            { id: 0, query: "No matching query found", data: [] },
            ...prev.slice(0, 4),
          ]);
        }
      } else {
        setSelectedQuery({
          id: 0,
          query: "Invalid query format",
          data: [],
        });
        setHistory((prev) => [
          { id: 0, query: "Invalid query format", data: [] },
          ...prev.slice(0, 4),
        ]);
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleClearQuery = () => {
    setCustomQuery("");
  };

  const handleQuerySelect = useCallback(
    (queryId: number) => {
      const query = mockQueries.find((q) => q.id === queryId);
      if (query) {
        setSelectedQuery(query);
        setCustomQuery(query.query);
        setDrawerOpen(false);
        setQueryError(null);
      }
    },
    [setCustomQuery, setDrawerOpen, setQueryError, setSelectedQuery]
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        borderRadius: 1,
      }}
    >
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "80%", sm: 300 },
            bgcolor: "background.paper",
            p: 2,
          },
        }}
      >
        {/* mobile view of the sidebar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              color: `${mode === "light" ? "white" : "black"}`,
            }}
          >
            <AccountTreeIcon sx={{ mr: 1, fontSize: "1.5rem" }} />
            QueryFlow
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Predefined Queries
          </Typography>
          <QuerySelector
            queries={mockQueries}
            selectedQueryId={selectedQuery.id}
            onSelect={handleQuerySelect}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <QueryHistory history={history} onSelect={handleQuerySelect} />
        </Box>
      </Drawer>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 2, md: 4 },
        }}
      >
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            px: 2,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: "none" }, mr: 1 }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: `${mode === "light" ? "black" : "white"}`,
              }}
            >
              <AccountTreeIcon sx={{ mr: 1, fontSize: "1.5rem" }} />
              QueryFlow
            </Typography>

            <Tooltip
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              <IconButton
                sx={{
                  color: `${mode === "light" ? "black" : "white"}`,
                }}
                onClick={toggleTheme}
                color="inherit"
              >
                {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, py: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: 300 },
                display: { xs: "none", md: "block" },
              }}
            >
              <Card sx={{ border: 1, borderRadius: 2, borderColor: "divider" }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Predefined Queries
                  </Typography>
                  <QuerySelector
                    queries={mockQueries}
                    selectedQueryId={selectedQuery.id}
                    onSelect={handleQuerySelect}
                  />
                  <QueryHistory
                    history={history}
                    onSelect={handleQuerySelect}
                  />
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  mb: 3,
                  border: 1,
                  borderRadius: 2,
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Write Your Query
                  </Typography>
                  <QueryInput
                    query={customQuery}
                    queryError={queryError}
                    onChange={setCustomQuery}
                  />
                  {rateLimitMessage && (
                    <Alert
                      severity="warning"
                      sx={{ mt: 2, border: 0, borderRadius: 1 }}
                    >
                      {rateLimitMessage}
                    </Alert>
                  )}
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 2,
                      width: { xs: "100%", sm: "30%" },
                    }}
                  >
                    <Tooltip
                      title={
                        rateLimitMessage
                          ? rateLimitMessage
                          : "Execute the query"
                      }
                    >
                      <span>
                        <Button
                          variant="contained"
                          onClick={handleRunQuery}
                          disabled={isLoading || !canMakeRequest()}
                          startIcon={
                            isLoading ? <CircularProgress size={20} /> : null
                          }
                          sx={{ flex: 1 }}
                        >
                          {isLoading ? "Running..." : "Run Query"}
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Clear the query input">
                      <Button
                        variant="outlined"
                        onClick={handleClearQuery}
                        sx={{ flex: 1 }}
                      >
                        Clear Query
                      </Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ border: 1, borderRadius: 2, borderColor: "divider" }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Results
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      overflowX: "auto",
                      maxWidth: "100%",
                    }}
                  >
                    {isLoading ? (
                      <SkeletonTable />
                    ) : selectedQuery.id === 5 ? (
                      <VirtualTable data={selectedQuery.data} />
                    ) : (
                      <DataTable data={selectedQuery.data} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
