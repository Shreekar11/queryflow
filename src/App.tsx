import { Query } from "./types";
import { useState } from "react";
import { mockQueries } from "./data/queries";

// custom components
import DataTable from "./components/data-table";
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
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

// Generic mock data for custom queries
const genericMockData = [
  { id: 1, result: "Custom Result 1", value: 100 },
  { id: 2, result: "Custom Result 2", value: 200 },
];

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query>(mockQueries[0]);
  const [customQuery, setCustomQuery] = useState<string>(mockQueries[0].query);

  const handleRunQuery = () => {
    setIsLoading(true);

    // added a dummy timeout to simulate an API call and show the loading state
    setTimeout(() => {
      const matchingQuery = mockQueries.find(
        (q) => q.query.trim().toLowerCase() === customQuery.trim().toLowerCase()
      );
      if (matchingQuery) {
        setSelectedQuery(matchingQuery);
      } else {
        const customQueryEntry: Query = {
          id: history.length + 1,
          query: customQuery,
          data: genericMockData,
        };
        setSelectedQuery(customQueryEntry);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleClearQuery = () => {
    setCustomQuery("");
  };

  const handleQuerySelect = (queryId: number) => {
    const query = mockQueries.find((q) => q.id === queryId);
    if (query) {
      setSelectedQuery(query);
      setCustomQuery(query.query);
      setDrawerOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
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
            sx={{ display: "flex", alignItems: "center" }}
          >
            <QueryStatsIcon sx={{ mr: 1 }} />
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
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                flexGrow1: 1,
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
              }}
            >
              <QueryStatsIcon sx={{ mr: 1 }} />
              QueryFlow - SQL Query Runner
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, py: { xs: 2, md: 4 } }}>
          {/* <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            SQL Query Runner
          </Typography> */}
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
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Predefined Queries
                  </Typography>
                  <QuerySelector
                    queries={mockQueries}
                    selectedQueryId={selectedQuery.id}
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
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Write Your Query
                  </Typography>
                  <TextField
                    label="SQL Query"
                    multiline
                    rows={6}
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="Type your SQL query here..."
                    InputProps={{
                      style: { fontFamily: "monospace", fontSize: "14px" },
                    }}
                    sx={{ bgcolor: "background.paper" }}
                  />
                  <Box sx={{ mt: 2, display: "flex", gap: 2, width: "30%" }}>
                    <Tooltip title="Execute the query">
                      <Button
                        variant="contained"
                        onClick={handleRunQuery}
                        disabled={isLoading}
                        startIcon={
                          isLoading ? <CircularProgress size={20} /> : null
                        }
                        sx={{ flex: 1 }}
                      >
                        {isLoading ? "Running..." : "Run Query"}
                      </Button>
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
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Results
                  </Typography>
                  <DataTable data={selectedQuery.data} />
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
