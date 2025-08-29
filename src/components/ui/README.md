# UI Components

This folder contains reusable UI components for the Voice Assistant application.

## Components

### Button
A versatile button component with different variants and sizes.

```tsx
import { Button } from './ui';

<Button 
  onClick={handleClick}
  variant="primary" // 'primary' | 'secondary' | 'danger'
  size="md" // 'sm' | 'md' | 'lg'
  fullWidth={false}
>
  Button Text
</Button>
```

### CircularButton
A circular button component for control buttons like microphone, play/pause, etc.

```tsx
import { CircularButton } from './ui';

<CircularButton
  onClick={handleClick}
  icon={<PlayIcon />}
  bgColor="bg-gray-300 hover:bg-gray-400"
  iconColor="text-gray-700"
  ariaLabel="Play"
  size="lg" // 'sm' | 'md' | 'lg'
/>
```

### IconButton
A simple icon button for smaller UI elements.

```tsx
import { IconButton } from './ui';

<IconButton
  onClick={handleClick}
  icon={<SettingsIcon />}
  ariaLabel="Settings"
  size="md" // 'sm' | 'md' | 'lg'
  className="custom-class"
/>
```

### Modal
A modal dialog component for confirmations and dialogs.

```tsx
import { Modal } from './ui';

<Modal
  isOpen={showModal}
  title="Confirm Action"
>
  <p>Modal content goes here</p>
  <div className="flex space-x-3">
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button onClick={handleCancel}>Cancel</Button>
  </div>
</Modal>
```

### StatusIndicator
A status indicator for showing active/paused states.

```tsx
import { StatusIndicator } from './ui';

<StatusIndicator status="active" /> // 'active' | 'paused'
```

## Icons

All icons are exported from the `icons.tsx` file:

- `MicrophoneIcon` - Regular microphone icon
- `MicrophoneOffIcon` - Muted microphone icon
- `PlayIcon` - Play button icon
- `PauseIcon` - Pause button icon
- `RestartIcon` - Restart/refresh icon
- `SettingsIcon` - Settings/hamburger menu icon
- `LeftArrowIcon` - Left navigation arrow
- `RightArrowIcon` - Right navigation arrow

## Usage

Import components from the UI folder:

```tsx
import { 
  Button, 
  CircularButton, 
  IconButton, 
  Modal, 
  StatusIndicator,
  MicrophoneIcon,
  PlayIcon 
} from './ui';
```

## Styling

All components use Tailwind CSS classes and follow the application's design system:
- Gray color scheme for neutral elements
- Consistent spacing and sizing
- Hover and focus states
- Accessibility features (aria-labels, focus rings)
