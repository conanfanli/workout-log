import * as React from "react";
import CloudOff from "@mui/icons-material/CloudOff";
import { getEventService } from "../indexeddb/service";
import CloudSync from "@mui/icons-material/CloudSync";
import PublishedWithChanges from "@mui/icons-material/PublishedWithChanges";
import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { IEventService } from "../indexeddb/service";

function getStateDiffLabel(diffInMs: number): string {
  if (!diffInMs) {
    return "in sync";
  }

  const minutes = diffInMs / 1000 / 60;
  if (minutes < 60) {
    return `${Number(minutes).toFixed(0)} minutes`;
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return `${Number(hours).toFixed(0)} hours`;
  }
  return `${Number(hours / 24).toFixed(0)} days`;
}

export function ExercisePageBottomNavigation() {
  console.log("render bottom navigation");
  const service = React.useMemo(() => getEventService(), []);

  const stateDiff = useLiveQuery(() => service.getStateDiff(), [service]) || 0;

  return (
    <Paper
      sx={{ position: "fixed", bottom: 1, left: 0, right: 0 }}
      elevation={3}
    >
      <SheetConnectionStatus eventService={service} />
      <Button
        endIcon={<CloudSync color="primary" />}
        onClick={async () => {
          await service.syncState();
          window.location.reload();
        }}
      >
        {getStateDiffLabel(stateDiff)}
      </Button>
    </Paper>
  );
}

function SheetConnectionStatus({
  eventService,
}: {
  eventService: IEventService;
}) {
  console.log("render sheet connection");
  const [connected, setConnected] = React.useState("");

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      const connectedSheetName = await eventService.getConnectedSheetName();
      console.log("sheet name is", connectedSheetName);
      setConnected(connectedSheetName);
    };

    fetchData();
  }, [eventService]);

  console.log(222, connected);
  return (
    <Button
      endIcon={
        connected ? (
          <PublishedWithChanges color="success" />
        ) : (
          <CloudOff
            color="error"
            onClick={() => navigate("/spreadsheet/authorize")}
          />
        )
      }
    >
      {`${connected ? `${connected}` : "offline"}`}
    </Button>
  );
}
