import { TypeAnimation } from 'react-type-animation';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  loop?: boolean;
  delayBetweenLoops?: number;
}

const TypingText = ({ text, speed = 50, className = '', loop = true, delayBetweenLoops = 2000 }: TypingTextProps) => {
  return (
    <span className="relative inline-block text-left">
      {/* Invisible text to maintain exact width and prevent layout shift (jiggling) */}
      <span className="invisible pointer-events-none">{text}</span>
      
      {/* Absolutely positioned typing animation */}
      <span className="absolute left-0 top-0 whitespace-nowrap">
        <TypeAnimation
          sequence={[
            text,
            delayBetweenLoops,
            '',
            500,
          ]}
          wrapper="span"
          speed={speed as any}
          className={className}
          repeat={loop ? Infinity : 0}
          cursor={true}
        />
      </span>
    </span>
  );
};

export default TypingText;

