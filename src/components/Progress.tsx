import { Slider } from '@nextui-org/react';

type ProgressProps = {
  value: number | undefined;
  onChangeEnd?: (value: number) => void;
};
function Progress(props: ProgressProps) {
  const { value, onChangeEnd } = props;

  return (
    <Slider
      showTooltip
      step={0.01}
      formatOptions={{ style: 'percent' }}
      maxValue={1}
      minValue={0}
      marks={[
        {
          value: 0,
          label: '0%',
        },
        {
          value: 0.2,
          label: '20%',
        },
        {
          value: 0.5,
          label: '50%',
        },
        {
          value: 0.8,
          label: '80%',
        },
        {
          value: 1,
          label: '100%',
        },
      ]}
      value={value !== undefined ? value / 100 : 0}
      onChangeEnd={(newValue) => {
        if (onChangeEnd && typeof newValue === 'number') {
          onChangeEnd(newValue * 100);
        }
      }}
      defaultValue={1}
      className="max-w-md"
    />
  );
}
export default Progress;
