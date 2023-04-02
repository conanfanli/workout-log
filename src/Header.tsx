import CloudSync from "@mui/icons-material/CloudSync";
import CloudOff from "@mui/icons-material/CloudOff";
import { Button, Box, AppBar, Toolbar } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getEventService, IEventService } from "./indexeddb/service";
import { BackButton } from "./BackButton";
import { NavDrawer } from "./NavDrawer";

export function Header() {
  const [connected, setConnected] = React.useState("");

  const eventService = React.useMemo(() => getEventService(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      const connectedSheetName = await eventService.getConnectedSheetName();
      console.log("sheet name is", connectedSheetName);
      setConnected(connectedSheetName);
    };

    fetchData();
  }, [eventService]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar color="default" position="static">
          <Toolbar>
            <NavDrawer />
            <div style={{ flexGrow: 1 }}>
              {connected ? (
                <SyncButton eventService={eventService} />
              ) : (
                <OfflineButton />
              )}
            </div>
            <BackButton />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

function OfflineButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate("/spreadsheet/authorize")}
      endIcon={<CloudOff color="error" />}
    >
      offline
    </Button>
  );
}
function SyncButton({ eventService }: { eventService: IEventService }) {
  console.log("render sheet connection");
  const stateDiff =
    useLiveQuery(async () => eventService.getStateDiff(), [eventService]) || 0;

  return (
    <Button
      endIcon={<CloudSync color="primary" />}
      onClick={async () => {
        await eventService.syncState();
      }}
    >
      {getStateDiffLabel(stateDiff)}
    </Button>
  );
}

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
