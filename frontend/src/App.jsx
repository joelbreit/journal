import { useState } from 'react';
import { Button, Link, Card, Tag, Input } from './components/ui';

function App() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-serif font-bold text-amber-950">
            Journal Component Library
          </h1>
          <p className="text-lg text-amber-700">
            Warm, inviting components for personal reflection
          </p>
        </div>

        {/* Buttons Section */}
        <Card>
          <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </Card>

        {/* Tags Section */}
        <Card>
          <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            <Tag color="personal">Personal</Tag>
            <Tag color="work">Work</Tag>
            <Tag color="gratitude">Gratitude</Tag>
            <Tag color="goals">Goals</Tag>
            <Tag color="reflection">Reflection</Tag>
            <Tag color="amber">Default</Tag>
          </div>
        </Card>

        {/* Input Section */}
        <Card>
          <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">
            Input Fields
          </h2>
          <div className="space-y-4">
            <Input
              label="Entry Title"
              placeholder="What's on your mind?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="With Error"
              placeholder="Invalid input"
              error="This field is required"
            />
          </div>
        </Card>

        {/* Cards Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">
            Cards
          </h2>

          <Card>
            <h3 className="text-xl font-serif font-semibold text-amber-950 mb-2">
              Static Card
            </h3>
            <p className="text-amber-800 leading-relaxed">
              This is a basic card with warm borders and soft shadows.
              It provides a gentle container for content.
            </p>
          </Card>

          <Card hover>
            <h3 className="text-xl font-serif font-semibold text-amber-950 mb-2">
              Hoverable Card
            </h3>
            <p className="text-amber-800 leading-relaxed">
              This card has hover effects - try moving your cursor over it!
              Perfect for entry cards that users can click.
            </p>
          </Card>

          <Card hover className="border-2 border-rose-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-2xl font-serif font-bold text-amber-950 mb-1">
                  Morning Reflections
                </h3>
                <p className="text-sm text-amber-600">
                  January 14, 2026 • 2 hours ago
                </p>
              </div>
              <div className="flex gap-1">
                <Tag color="personal">Personal</Tag>
                <Tag color="gratitude">Gratitude</Tag>
              </div>
            </div>
            <p className="text-amber-800 leading-relaxed font-serif text-lg">
              Today was a beautiful day. I woke up early and watched the sunrise
              from my window. There's something magical about those quiet morning
              moments before the world wakes up...
            </p>
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-amber-600">
              342 words
            </div>
          </Card>
        </div>

        {/* Typography Section */}
        <Card>
          <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">
            Typography
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-amber-600 mb-1">Serif (Crimson Text) - For content</p>
              <p className="font-serif text-lg leading-relaxed text-amber-950">
                The quick brown fox jumps over the lazy dog. This is the font we'll use
                for journal entries to create that warm, handwritten notebook feel.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600 mb-1">Sans-serif (Inter) - For UI</p>
              <p className="text-sm text-amber-950">
                The quick brown fox jumps over the lazy dog. This is the font for buttons,
                labels, and interface elements.
              </p>
            </div>
          </div>
        </Card>

        {/* Links Section */}
        <Card>
          <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">
            Links
          </h2>
          <div className="space-y-2">
            <p className="text-amber-800">
              Visit our <Link href="#docs">documentation</Link> to learn more.
            </p>
            <p className="text-amber-800">
              You can also check out the{' '}
              <Link href="#guide">getting started guide</Link> or read some{' '}
              <Link href="#examples">example entries</Link>.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-amber-600 text-sm">
            Warm, inviting design for personal reflection
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
