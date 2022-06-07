import 'dart:developer' as developer;
import 'package:flame/components.dart';
import 'package:flame/sprite.dart';
import 'world/grass.dart';
import 'world/direction.dart';

class World extends PositionComponent with HasGameRef {
  @override
  Future<void>? onLoad() async {
    var grassSheet = SpriteSheet(
      image: await gameRef.images.load('tiles/grass.png'),
      srcSize: Vector2(16.0, 16.0),
    );

    final grass00 =
    Grass(sheet: grassSheet, direction: GroundDirection.top_left);
    final grass01 = Grass(sheet: grassSheet, direction: GroundDirection.top);
    final grass02 =
    Grass(sheet: grassSheet, direction: GroundDirection.top_right);

    final grass10 = Grass(sheet: grassSheet, direction: GroundDirection.left);
    final grass11 = Grass(sheet: grassSheet, direction: GroundDirection.center);
    final grass12 = Grass(sheet: grassSheet, direction: GroundDirection.right);

    final grass20 =
    Grass(sheet: grassSheet, direction: GroundDirection.bottom_left);
    final grass21 = Grass(sheet: grassSheet, direction: GroundDirection.bottom);
    final grass22 =
    Grass(sheet: grassSheet, direction: GroundDirection.bottom_right);

    final size = grass00.width;

    grass00.position = Vector2(size * 0, 0.0);
    grass01.position = Vector2(size * 1, 0.0);
    grass02.position = Vector2(size * 2, 0.0);

    grass10.position = Vector2(size * 0, size * 1.0);
    grass11.position = Vector2(size * 1, size * 1.0);
    grass12.position = Vector2(size * 2, size * 1.0);

    grass20.position = Vector2(size * 0, size * 2.0);
    grass21.position = Vector2(size * 1, size * 2.0);
    grass22.position = Vector2(size * 2, size * 2.0);

    await add(grass00);
    await add(grass01);
    await add(grass02);

    await add(grass10);
    await add(grass11);
    await add(grass12);

    await add(grass20);
    await add(grass21);
    await add(grass22);

    return super.onLoad();
  }
}
