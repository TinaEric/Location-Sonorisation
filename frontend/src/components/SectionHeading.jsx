export default function SectionHeading({ id, title, text, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 id={id} className="display text-2xl sm:text-3xl">
          {title}
        </h2>
        {text && <p className="mt-3 text-base-content/75">{text}</p>}
      </div>
      {action}
    </div>
  );
}
