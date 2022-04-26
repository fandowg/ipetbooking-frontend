import { normalize, schema } from 'normalizr'

export function groupByInterval(original) {
  const monthlySchema = new schema.Entity('monthly')
  const annualSchema = new schema.Entity('annual')
  const intervalArray = new schema.Array(
    {
      monthly: monthlySchema,
      annual: annualSchema,
    },
    (input) => input.interval
  )
  return normalize(original, intervalArray).entities
}

export function groupById(original, entityName) {
  if (!original) return
  const groupSchema = new schema.Entity(entityName)
  const groupArraySchema = [groupSchema]
  return normalize(original, groupArraySchema).entities[entityName]
}
