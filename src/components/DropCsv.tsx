import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconFile, IconUpload, IconX } from '@tabler/icons';

export function DropCsv(
  props: Partial<DropzoneProps> & {
    onDrop(files: File[]): void;
  },
) {
  const theme = useMantineTheme();
  return (
    <Dropzone
      maxSize={3 * 1024 ** 2}
      accept={['text/csv']}
      maxFiles={1}
      {...props}
    >
      <Group
        position='center'
        spacing='xl'
        style={{ minHeight: 220, pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === 'dark' ? 4 : 6
                ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFile size={50} stroke={1.5} />
        </Dropzone.Idle>

        <Text size='xl' inline>
          Drag CSV here or click to select files
        </Text>
      </Group>
    </Dropzone>
  );
}