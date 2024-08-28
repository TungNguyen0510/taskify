import 'gantt-task-react/dist/index.css';

import { Button, Switch } from '@nextui-org/react';
import { ViewMode } from 'gantt-task-react';
import React from 'react';

type ViewSwitcherProps = {
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};
export const ViewSwitcher = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
}: ViewSwitcherProps) => {
  return (
    <div className="flex items-center justify-between">
      <Switch
        isSelected={isChecked}
        onValueChange={() => onViewListChange(!isChecked)}
      >
        Show Task List
      </Switch>
      <div className="flex items-center justify-end gap-2 py-2">
        <Button onClick={() => onViewModeChange(ViewMode.Hour)}>Hour</Button>
        <Button onClick={() => onViewModeChange(ViewMode.QuarterDay)}>
          Quarter of Day
        </Button>
        <Button onClick={() => onViewModeChange(ViewMode.HalfDay)}>
          Half of Day
        </Button>
        <Button onClick={() => onViewModeChange(ViewMode.Day)}>Day</Button>
        <Button onClick={() => onViewModeChange(ViewMode.Week)}>Week</Button>
        <Button onClick={() => onViewModeChange(ViewMode.Month)}>Month</Button>
        <Button onClick={() => onViewModeChange(ViewMode.Year)}>Year</Button>
      </div>
    </div>
  );
};
