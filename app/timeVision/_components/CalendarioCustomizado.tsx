import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './customCalendar.module.css';

const CalendarioCustomizado: React.FC = () => {
  return (
    <div>
      <div className={styles.dayPickerWrapper}>
        <DayPicker
          modifiersClassNames={{
            selected: styles.selectedDay
          }}
          captionLayout='dropdown'          
        />
      </div>
    </div>
  );
};

export default CalendarioCustomizado;
