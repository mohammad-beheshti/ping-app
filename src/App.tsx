import {Group, Text, useMantineTheme, Center, Button} from "@mantine/core";
import {IconUpload, IconPhoto, IconX} from "@tabler/icons";
import {Dropzone, DropzoneProps} from "@mantine/dropzone";
import {useState} from "react";
import * as Yup from "yup";
import {pingServer} from "./rust-calls/ping";

interface IPing {
  sequence: string;
  ip: string;
  port: string;
  waitInMs: string;
}

function DropCsv(
  props: Partial<DropzoneProps> & {
    onDrop(files: File[]): void;
  },
) {
  const theme = useMantineTheme();
  return (
    <Dropzone
      maxSize={3 * 1024 ** 2}
      accept={["text/csv"]}
      maxFiles={1}
      {...props}
    >
      <Group
        position="center"
        spacing="xl"
        style={{minHeight: 220, pointerEvents: "none"}}
      >
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={50} stroke={1.5} />
        </Dropzone.Idle>

        <Text size="xl" inline>
          Drag CSV here or click to select files
        </Text>
      </Group>
    </Dropzone>
  );
}

const validationSchema = Yup.array(
  Yup.object().shape({
    sequence: Yup.number().required(),
    ip: Yup.string()
      .required("IP is required")
      .matches(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        "IP is invalid",
      ),
    port: Yup.number()
      .required("Port is required")
      .min(1, "Port is invalid")
      .max(65535, "Port is invalid"),
    waitInMs: Yup.number(),
  }),
);

export default function App() {
  const [data, setData] = useState<IPing[]>();
  const [error, setError] = useState<Error | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const onDrop = async (files: File[]) => {
    try {
      setError(null);
      setData(await parseCSV(files[0]));
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      }
      setError(new Error("Error while parsing CSV"));
    }
  };
  const onPing = async () => {
    if (!data) {
      return;
    }
    setIsPinging(true);
    try {
      for (const server of data.sort(
        (a, b) => Number(a.sequence) - Number(b.sequence),
      )) {
        await pingServer(server.ip + ":" + server.port, +server.waitInMs);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      }
      setError(new Error("Error while pinging"));
    }
    setIsPinging(false);
  };
  if (isPinging)
    return (
      <Center style={{flexDirection: "column", height: "100%"}}>
        <Text size="md" weight="bolder">
          Pinging...
        </Text>
      </Center>
    );
  if (!data)
    return (
      <Center style={{flexDirection: "column", height: "100%"}}>
        <DropCsv
          mb="xs"
          onDrop={onDrop}
          onReject={() => setError(new Error("Some files were rejected"))}
        />
        {error && (
          <Text size="md" weight="bolder" color="red">
            {error.message}
          </Text>
        )}
      </Center>
    );
  return (
    <Center style={{flexDirection: "column", height: "100%"}}>
      <Button
        mb="xs"
        color="blue"
        style={{width: "100px", height: "50px"}}
        onClick={onPing}
      >
        <Text size="md" weight="bolder">
          Ping
        </Text>
      </Button>
      <Button color="orange" onClick={() => setData(undefined)}>
        Clear
      </Button>
      {error && (
        <Text size="md" weight="bolder" color="red">
          {error.message}
        </Text>
      )}
    </Center>
  );
}

function parseCSV(file: File): Promise<IPing[]> {
  const reader = new FileReader();
  reader.readAsText(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const csv = reader.result;
      const lines = (csv as string).split("\n");
      const headers = lines[0].split(",");
      const data = lines.slice(1).map((line) => {
        const obj = {} as Record<string, string>;
        const currentLine = line.split(",");
        headers.forEach((header, index) => {
          obj[header] = currentLine[index];
        });
        return obj;
      });
      if (validationSchema.isValidSync(data)) {
        resolve(data as unknown as IPing[]);
      }
      reject(new Error("Invalid CSV"));
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
