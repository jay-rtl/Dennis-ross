import { PageHeading, ButtonLink } from '@/components/editorial';
export default function NotFound() {
  return (
    <>
      <PageHeading
        eyebrow="404 · A PAGE OUT OF PLACE"
        title="This chapter hasn’t been written."
        description="The page you’re looking for may have moved, or may not be available yet."
      />
      <div className="container checkout-return">
        <ButtonLink href="/">Return to the beginning</ButtonLink>
      </div>
    </>
  );
}
