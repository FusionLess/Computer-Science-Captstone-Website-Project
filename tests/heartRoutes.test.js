import {test} from 'node:test'
import assert from 'node:assert/strict'
import {
    getHeartPath, getHeartStateFromRoute, getComplexityFromRoute,
    getComparePath, getCompareHeartFromRoute,
} from '../src/utils/heartRoutes.ts'

const states = [
    ['healthy', 'Healthy', 'heart'],
    ['attack', 'Minor', 'heart-attack'],
    ['attack', 'Severe', 'heart-attack'],
    ['electricity', 'Fibrillation', 'heart-electricity'],
    ['failure', 'Compensated', 'heart-failure'],
    ['failure', 'Decompensated', 'heart-failure'],
]

for (const [category, option, route] of states) {
    test(`${option} links resolve to the correct heart in every complexity`, () => {
        for (const complexity of ['basic', 'standard', 'advanced']) {
            const path = getHeartPath(complexity, category, option)
            assert.equal(path, `/${complexity}/${route}/${option.toLowerCase()}`)
            const [, parsedComplexity, parsedCategory, parsedOption] = path.split('/')
            assert.equal(getComplexityFromRoute(parsedComplexity), complexity)
            assert.deepEqual(getHeartStateFromRoute(parsedCategory, parsedOption), {category, option})
            assert.deepEqual(getCompareHeartFromRoute(parsedOption), {category, option})
        }
    })
}

test('comparison links preserve the selected hearts and their order', () => {
    const first = {category: 'failure', option: 'Decompensated'}
    const second = {category: 'healthy', option: 'Healthy'}
    const path = getComparePath('advanced', first, second)
    assert.equal(path, '/advanced/compare/decompensated/healthy')
    const segments = path.split('/')
    assert.deepEqual(getCompareHeartFromRoute(segments[3]), first)
    assert.deepEqual(getCompareHeartFromRoute(segments[4]), second)
})

test('unknown and incomplete URLs are rejected', () => {
    for (const value of [undefined, '', 'unknown', 'Advanced']) {
        assert.equal(getComplexityFromRoute(value), null)
    }
    for (const value of [undefined, '', 'unknown']) {
        assert.equal(getCompareHeartFromRoute(value), null)
    }
    assert.equal(getHeartStateFromRoute(undefined, undefined), null)
    assert.equal(getHeartStateFromRoute('heart-attack', 'healthy'), null)
    assert.equal(getHeartStateFromRoute('heart', 'minor'), null)
    assert.equal(getHeartStateFromRoute('unknown', 'healthy'), null)
})
