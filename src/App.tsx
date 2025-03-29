import { toast } from "sonner";
import { Query } from "./types";
import { mockQueries } from "./data";
import { useTheme } from "./context/theme-context";
import { useCallback, useState, lazy, Suspense } from "react";

import "./styles/App.css";

// lazy-load components
const DataTable = lazy(() => import("./components/data-table"));
const QueryInput = lazy(() => import("./components/query-input"));
const QueryHistory = lazy(() => import("./components/query-history"));
const VirtualTable = lazy(() => import("./components/virtual-table"));
const SkeletonTable = lazy(() => import("./components/table-skeleton"));
const QuerySelector = lazy(() => import("./components/query-selector"));

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
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";

const AppHeader = ({
  mode,
  toggleTheme,
  setDrawerOpen,
}: {
  mode: "light" | "dark";
  toggleTheme: () => void;
  setDrawerOpen: (open: boolean) => void;
}) => (
  <AppBar
    position="static"
    color="transparent"
    elevation={0}
    className="app-header"
    sx={{
      bgcolor: "background.paper",
      borderColor: "divider",
      px: { xs: 1, md: 2 },
    }}
  >
    <Toolbar className="app-toolbar">
      <IconButton
        edge="start"
        onClick={() => setDrawerOpen(true)}
        sx={{
          display: { md: "none" },
          mr: 1,
          color: mode === "light" ? "black" : "white",
        }}
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
          fontSize: { xs: "0.9rem", md: "1.25rem" },
          color: mode === "light" ? "black" : "white",
        }}
      >
        {mode === "light" ? (
          <img
            src="/black_logo.svg"
            alt="QueryFlow Logo"
            style={{ width: "32px", height: "32px" }}
          />
        ) : (
          <img
            src="/white_logo.svg"
            alt="QueryFlow Logo"
            style={{ width: "32px", height: "32px" }}
          />
        )}
        ueryFlow
      </Typography>

      <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
        <IconButton
          sx={{
            color: mode === "light" ? "black" : "white",
          }}
          onClick={toggleTheme}
          color="inherit"
        >
          {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Toolbar>
  </AppBar>
);

const MobileDrawer = ({
  mode,
  drawerOpen,
  setDrawerOpen,
  selectedQuery,
  history,
  handleQuerySelect,
  isMobile,
}: {
  mode: "light" | "dark";
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  selectedQuery: Query;
  history: Query[];
  handleQuerySelect: (queryId: number) => void;
  isMobile: boolean;
}) =>
  isMobile && (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          bgcolor: "background.paper",
        },
      }}
      classes={{ paper: "app-drawer-paper" }}
    >
      <Box className="app-drawer-header">
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            color: mode === "light" ? "black" : "white",
          }}
        >
          {mode === "light" ? (
            <img
              src="/black_logo.svg"
              alt="QueryFlow Logo"
              style={{ width: "32px", height: "32px" }}
            />
          ) : (
            <img
              src="/white_logo.svg"
              alt="QueryFlow Logo"
              style={{ width: "32px", height: "32px" }}
            />
          )}
          ueryFlow
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
        <Suspense fallback={<Typography>Loading queries...</Typography>}>
          <QuerySelector
            queries={mockQueries}
            selectedQueryId={selectedQuery.id}
            onSelect={handleQuerySelect}
          />
        </Suspense>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Suspense fallback={<Typography>Loading history...</Typography>}>
          <QueryHistory history={history} onSelect={handleQuerySelect} />
        </Suspense>
      </Box>
    </Drawer>
  );

function App() {
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [history, setHistory] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query>(mockQueries[0]);
  const [customQuery, setCustomQuery] = useState<string>(mockQueries[0].query);

  /**
   * @description Handles the execution of a query by checking rate limits, validating the query,
   * and simulating an API call to fetch results. Updates the query history and selected
   * query state based on the results.
   *
   * @remarks
   * - If the rate limit is exceeded, the function exits early.
   * - If the query is empty, it sets an error and exits.
   * - Simulates an API call with a 1-second delay to show a loading state.
   * - Displays a success or error toast based on the query execution result.
   *
   * @returns {void}
   */
  const handleRunQuery = () => {
    setIsLoading(true);

    if (customQuery.trim() === "") {
      setIsLoading(false);
      setQueryError("Query cannot be empty");
      return;
    }

    setQueryError(null);

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
          setHistory((prev) => [baseQuery, ...prev]);
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

        toast.success("Query executed successfully");
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

        toast.error("Invalid query format");
      }

      setIsLoading(false);
    }, 1000);
  };

  /**
   * @description Clears the current query input and displays a success toast notification.
   *
   * @remarks
   * - Resets the `customQuery` state to an empty string.
   * - Shows a toast notification to confirm the query has been cleared.
   *
   * @returns {void}
   */
  const handleClearQuery = () => {
    setCustomQuery("");
    toast.success("Query cleared successfully");
  };

  /**
   * @description Handles the selection of a predefined query from the query list or history.
   * Updates the selected query, sets the query input value, closes the drawer,
   * and clears any existing query errors.
   *
   * @param {number} queryId - The ID of the query to select.
   *
   * @remarks
   * - Finds the query in `mockQueries` by matching the provided `queryId`.
   * - If a matching query is found, updates the `selectedQuery` and `customQuery` states,
   *   closes the drawer, and clears any query errors.
   * - Wrapped in `useCallback` to prevent unnecessary re-renders.
   *
   * @returns {void}
   */
  const handleQuerySelect = useCallback(
    (queryId: number) => {
      const query = mockQueries.find((q) => q.id === queryId);
      if (query) {
        setSelectedQuery((prev) => ({
          id: query.id,
          query: query.query,
          data: prev.data,
        }));
        setCustomQuery(query.query);
        setDrawerOpen(false);
        setQueryError(null);
      }
    },
    [setCustomQuery, setDrawerOpen, setQueryError, setSelectedQuery]
  );

  return (
    <Box
      className="app-container"
      sx={{
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "background.default",
      }}
    >
      <MobileDrawer
        mode={mode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedQuery={selectedQuery}
        history={history}
        handleQuerySelect={handleQuerySelect}
        isMobile={isMobile}
      />

      <Box
        className="app-content"
        sx={{
          p: { xs: 1, md: 2 },
        }}
      >
        <AppHeader
          mode={mode}
          toggleTheme={toggleTheme}
          setDrawerOpen={setDrawerOpen}
        />

        <Box
          sx={{
            display: "flex",
            flex: 1,
            gap: { xs: 1, md: 2 },
            overflow: "hidden",
            py: 2,
          }}
        >
          <Box
            className="app-sidebar"
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <Card
              className="app-card"
              sx={{
                borderColor: "divider",
              }}
            >
              <CardContent className="app-card-content">
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Predefined Queries
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    pr: 1,
                  }}
                >
                  <Suspense
                    fallback={<Typography>Loading queries...</Typography>}
                  >
                    <QuerySelector
                      queries={mockQueries}
                      selectedQueryId={selectedQuery.id}
                      onSelect={handleQuerySelect}
                    />
                  </Suspense>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <Suspense
                    fallback={<Typography>Loading history...</Typography>}
                  >
                    <QueryHistory
                      history={history}
                      onSelect={handleQuerySelect}
                    />
                  </Suspense>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box className="app-query-container">
            <Card
              className="app-card"
              sx={{
                mb: { xs: 1, md: 2 },
                borderColor: "divider",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Write Your Query
                </Typography>
                <Suspense fallback={<Typography>Loading editor...</Typography>}>
                  <QueryInput
                    query={customQuery}
                    queryError={queryError}
                    onChange={setCustomQuery}
                  />
                </Suspense>
                <Box
                  className="app-button-container"
                  sx={{
                    gap: { xs: 1, md: 2 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Tooltip title="Execute the query">
                    <span>
                      <Button
                        variant="contained"
                        onClick={handleRunQuery}
                        disabled={isLoading}
                        startIcon={
                          isLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <PlayCircleFilledWhiteOutlinedIcon
                              sx={{ fontSize: 20 }}
                            />
                          )
                        }
                        sx={{
                          flex: 1,
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        {isLoading ? "Running..." : "Run Query"}
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Clear the query input">
                    <Button
                      variant="outlined"
                      onClick={handleClearQuery}
                      startIcon={
                        <RemoveCircleOutlineOutlinedIcon
                          sx={{ color: "background.main", fontSize: 20 }}
                        />
                      }
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Clear Query
                    </Button>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>

            <Card
              className="app-card"
              sx={{
                flex: 1,
                borderColor: "divider",
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Results
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >
                  <Suspense
                    fallback={<Typography>Loading results...</Typography>}
                  >
                    {isLoading ? (
                      <SkeletonTable />
                    ) : selectedQuery.id === 5 ? (
                      <VirtualTable data={selectedQuery} />
                    ) : (
                      <DataTable data={selectedQuery} />
                    )}
                  </Suspense>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
